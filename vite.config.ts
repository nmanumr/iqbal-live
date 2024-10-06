import {defineConfig, type UserConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    plugins: [react()],
  }

  if (command !== 'serve') {
    config.base = '/<your-repo-name>/'
  }

  return config
})