import { defineConfig } from 'vitest/config'

// Config de testes isolada da build de produção (vite.config.ts).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
