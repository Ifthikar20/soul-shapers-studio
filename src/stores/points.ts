// src/stores/points.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePointsStore = defineStore('points', () => {
    // State
    const points = ref(0)
    const streak = ref(0)
    const level = ref(1)
    const achievements = ref<string[]>([])

    // Getters
    const nextLevelPoints = computed(() => level.value * 100)
    const progressToNextLevel = computed(() => (points.value % 100) / 100)

    // Actions
    const addPoints = (amount: number) => {
        points.value += amount
        checkLevelUp()
    }

    const incrementStreak = () => {
        streak.value += 1
        if (streak.value % 7 === 0) {
            addAchievement('week_streak')
            addPoints(50)
        }
    }

    const resetStreak = () => {
        streak.value = 0
    }

    const checkLevelUp = () => {
        const newLevel = Math.floor(points.value / 100) + 1
        if (newLevel > level.value) {
            level.value = newLevel
            addAchievement(`level_${level.value}`)
        }
    }

    const addAchievement = (achievement: string) => {
        if (!achievements.value.includes(achievement)) {
            achievements.value.push(achievement)
        }
    }

    const setPoints = (data: { points: number; streak: number; level: number; achievements: string[] }) => {
        points.value = data.points
        streak.value = data.streak
        level.value = data.level
        achievements.value = data.achievements
    }

    return {
        // State
        points,
        streak,
        level,
        achievements,

        // Getters
        nextLevelPoints,
        progressToNextLevel,

        // Actions
        addPoints,
        incrementStreak,
        resetStreak,
        addAchievement,
        setPoints
    }
})
