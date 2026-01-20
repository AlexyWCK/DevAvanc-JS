/**
 * Error model
 * 
 * Used to represent an error response from the server
 * 
 * @member {number} code - Error code
 * @member {string} message - Error message (optional)
 */
export default interface Error {
  code: number;
  message?: string;
}