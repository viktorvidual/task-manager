import moment from 'moment';

/**
 * Checks if the provided date is today or in the past.
 *
 * @param {string} inputDate - The date to be checked.
 * @returns {boolean} - True if the provided date is today or in the past, false otherwise.
 */
export function isDateTodayOrPast(inputDate) {
    const providedDate = moment(inputDate).startOf('day');
    const today = moment().startOf('day');
  
    return providedDate.isSameOrBefore(today);
  }
  
/**
 * Sets an item in local storage with expiration.
 *
 * @param {string} key - The key under which the item will be stored.
 * @param {any} value - The value to be stored.
 * @param {number} expirationInDays - The expiration time in days.
 */
export function setItemWithExpiration(key, value, expirationInDays) {
    const expirationMS = expirationInDays * 24 * 60 * 60 * 1000; 
    const expirationTime = new Date().getTime() + expirationMS;
    const item = { value, expirationTime };
  
    localStorage.setItem(key, JSON.stringify(item));
  }

/**
 * Retrieves an item from local storage with expiration.
 *
 * @param {string} key - The key under which the item is stored.
 * @returns {any|null} - The stored value if not expired, or null if expired or not found.
 */
export function getItemWithExpiration(key) {
    const itemString = localStorage.getItem(key);
  
    if (!itemString) {
      return null;
    }
  
    const item = JSON.parse(itemString);
    const currentTime = new Date().getTime();
  
    if (currentTime > item.expirationTime) {
      // Item has expired, remove it from localStorage
      localStorage.removeItem(key);
      return null;
    }
  
    return item.value;
  }

  
