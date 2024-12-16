const MAX_RETRIES = 1; 
const INITIAL_BACKOFF = 1000; 

/**
 * Retries a given asynchronous function with exponential backoff.
 *
 * @template T The type of the value returned by the function.
 * @param {() => Promise<T>} fn - The asynchronous function to retry.
 * @param {number} [retryCount=0] - The current retry count. Defaults to 0.
 * @returns {Promise<T>} A promise that resolves to the value returned by the function, or rejects after the maximum number of retries.
 * @throws {Error} Throws an error if the function fails after the maximum number of retries.
*/
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>, 
  retryCount = 0      
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      if (error instanceof Error) {
        throw new Error(`Failed after ${MAX_RETRIES} retries: ${error.message}`);
      } else {
        throw new Error(`Failed after ${MAX_RETRIES} retries: Unknown error`);
      }
    }

    const delay = INITIAL_BACKOFF * Math.pow(2, retryCount);
    console.log(
      `Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms...`
    );

    await new Promise((resolve) => setTimeout(resolve, delay)); 

    return retryWithBackoff(fn, retryCount + 1);
  }
};
