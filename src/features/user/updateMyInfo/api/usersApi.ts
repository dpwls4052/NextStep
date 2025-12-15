import { api } from '@/shared/libs/axios'

export type Experience = {
  experienceId: string
  field: string
  year: number
}

export type UserProfile = {
  userId: string
  email: string
  name: string | null
  avatar: string | null
  experiences: Experience[]
}

export type PatchUsersBody = {
  name?: string
  experiences?: {
    create?: Array<{ field: string; year: number }>
    update?: Array<{ experienceId: string; field?: string; year?: number }>
    delete?: string[]
  }
}

export async function getUsers(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/users')
  return res.data
}

export async function patchUsers(body: PatchUsersBody) {
  const res = await api.patch('/users', body)
  return res.data as UserProfile & { message: string }
}
