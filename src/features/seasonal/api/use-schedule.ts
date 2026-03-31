import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Schedule, JikanListResponse } from '@/types/jikan'

type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

async function fetchSchedule(day?: WeekDay): Promise<JikanListResponse<Schedule>> {
  const url = day ? `/schedules/${day}` : '/schedules'
  const { data } = await apiClient.get<JikanListResponse<Schedule>>(url)
  return data
}

export function useSchedule(day?: WeekDay) {
  return useQuery({
    queryKey: day ? ['seasonal', 'schedule', day] : ['seasonal', 'schedule'],
    queryFn: () => fetchSchedule(day),
    staleTime: 1000 * 60 * 15,
  })
}
