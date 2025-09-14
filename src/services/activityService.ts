import { raffleService, ticketService, userService } from './api'

export interface Activity {
  id: string
  type: 'user_registered' | 'raffle_created' | 'ticket_purchased' | 'raffle_ended'
  description: string
  timestamp: string
  user?: string
  raffleId?: number
  amount?: number
}

class ActivityService {
  private activities: Activity[] = []
  private lastFetchTime: Date | null = null

  async generateRecentActivities(): Promise<Activity[]> {
    try {
      const activities: Activity[] = []
      
      const [raffles, tickets, users] = await Promise.all([
        raffleService.getAll().catch(() => []),
        ticketService.getAll().catch(() => []),
        userService.getAll().catch(() => [])
      ])

      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      raffles.forEach((raffle: any) => {
        const createdDate = new Date(raffle.startDate)
        if (createdDate >= oneDayAgo) {
          activities.push({
            id: `raffle-${raffle.id}`,
            type: 'raffle_created',
            description: `Nova rifa criada: ${raffle.title}`,
            timestamp: raffle.startDate,
            raffleId: raffle.id
          })
        }

        const endDate = new Date(raffle.endDate)
        if (endDate >= oneDayAgo && endDate <= now && raffle.status !== 1) {
          activities.push({
            id: `raffle-ended-${raffle.id}`,
            type: 'raffle_ended',
            description: `Rifa finalizada: ${raffle.title}`,
            timestamp: raffle.endDate,
            raffleId: raffle.id
          })
        }
      })

      const recentTickets = tickets.slice(-10)
      recentTickets.forEach((ticket: any, index: number) => {
        const minutesAgo = (10 - index) * 30
        const ticketTime = new Date(now.getTime() - minutesAgo * 60 * 1000)
        
        const raffle = raffles.find((r: any) => r.id === ticket.raffleId)
        const raffleName = raffle?.title || `Rifa #${ticket.raffleId}`
        
        activities.push({
          id: `ticket-${ticket.id}`,
          type: 'ticket_purchased',
          description: `Bilhete comprado na rifa: ${raffleName}`,
          timestamp: ticketTime.toISOString(),
          user: ticket.userName || 'Usuário anônimo',
          raffleId: ticket.raffleId,
          amount: ticket.value || raffle?.ticketPrice
        })
      })

      const recentUsers = users.slice(-5)
      recentUsers.forEach((user: any, index: number) => {
        const hoursAgo = (5 - index) * 2
        const userTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
        
        activities.push({
          id: `user-${user.id}`,
          type: 'user_registered',
          description: 'Novo usuário registrado',
          timestamp: userTime.toISOString(),
          user: user.name || user.email
        })
      })

      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      this.activities = activities.slice(0, 20)
      this.lastFetchTime = now
      
      return this.activities
    } catch (error) {
      console.error('Erro ao gerar atividades:', error)
      return this.activities
    }
  }

  async getRecentActivities(): Promise<Activity[]> {
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
    
    if (this.lastFetchTime && this.lastFetchTime > oneMinuteAgo && this.activities.length > 0) {
      return this.activities
    }
    
    return this.generateRecentActivities()
  }

  addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
    const newActivity: Activity = {
      ...activity,
      id: `manual-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    this.activities.unshift(newActivity)
    
    if (this.activities.length > 20) {
      this.activities = this.activities.slice(0, 20)
    }
  }

  clearCache(): void {
    this.activities = []
    this.lastFetchTime = null
  }
}

export const activityService = new ActivityService()