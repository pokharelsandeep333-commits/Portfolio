import { randomUUID } from 'node:crypto';

// One sorted set per visitor. Expire idle keys and make concurrent decisions atomic.
const minuteWindow = `
  local t = redis.call('TIME')
  local now = t[1] * 1000 + math.floor(t[2] / 1000)
  redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - 60000)
  if redis.call('ZCARD', KEYS[1]) >= 10 then return 0 end
  redis.call('ZADD', KEYS[1], now, ARGV[1])
  redis.call('PEXPIRE', KEYS[1], 60000)
  return 1
`;

// Charge both counters before each provider attempt, including fallbacks.
const dailyBudget = `
  local now = tonumber(redis.call('TIME')[1])
  local day = math.floor(now / 86400)
  local reset = (day + 1) * 86400
  local visitor = KEYS[1] .. ':' .. day
  local total = KEYS[2] .. ':' .. day
  if tonumber(redis.call('GET', visitor) or '0') >= tonumber(ARGV[1])
    or tonumber(redis.call('GET', total) or '0') >= tonumber(ARGV[2]) then
    return reset - now
  end
  redis.call('INCR', visitor)
  redis.call('INCR', total)
  redis.call('EXPIREAT', visitor, reset)
  redis.call('EXPIREAT', total, reset)
  return 0
`;

export function createLimits(redis, visitorBudget, totalBudget) {
  const connection = () => redis.withAbortSignal(AbortSignal.timeout(1500));
  return {
    async ready() { return await connection().ping() === 'PONG'; },
    async admit(ip) {
      return await connection().eval(minuteWindow, {
        keys: [`minute:${ip}`], arguments: [randomUUID()],
      }) === 1;
    },
    async reserve(ip) {
      return connection().eval(dailyBudget, {
        keys: [`visitor:${ip}`, 'total'], arguments: [String(visitorBudget), String(totalBudget)],
      });
    },
  };
}
