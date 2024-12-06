import { Duration } from 'luxon'

/**
 * 将秒数格式化为 00:00:00 的时长显示
 * @param {number} seconds 总秒数
 * @returns {string} 格式化后的时长
 */
export const formatDuration = (seconds) => {
  const duration = Duration.fromObject({ seconds })
  return duration.toFormat('hh:mm:ss')
}
