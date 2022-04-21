import { request } from '@/utils'

export const getRankplaylist = () => request.get('/toplist')
