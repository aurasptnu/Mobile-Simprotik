import { getActiveMobileTasks } from '../services/mobile';

export const tasks: any[] = []; // placeholder for local fallback

/**
 * Fetch tasks from backend using staff UUID
 */
export const fetchTasks = async (uuid: string) => {
  try {
    return await getActiveMobileTasks(uuid);
  } catch (error) {
    console.log('Error fetching tasks:', error);
    throw error;
  }
};
