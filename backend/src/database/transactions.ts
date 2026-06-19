import mongoose from 'mongoose'

/**
 * Runs a transactional session in Mongoose for database consistency safety.
 * Handles auto-commits and auto-rollbacks.
 * Note: Requires replica sets or local replica simulations.
 */
export async function runInTransaction<T>(
  action: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const result = await action(session)
    await session.commitTransaction()
    return result
  } catch (error) {
    console.error('Database transaction aborted. Rolling back changes...', error)
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export default runInTransaction
