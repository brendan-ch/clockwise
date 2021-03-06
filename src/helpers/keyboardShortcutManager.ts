import { Platform } from 'react-native';

interface KeyboardEvent {
  /**
   * Ordered keys in a combination (as determined from DOM).
   */
  keys: string[],
  /**
   * Action to run on the key combination
   */
  action: () => any,
}

/**
 * Manage keyboard shortcut initialization and event registering.
 */
class KeyboardShortcutManager {
  private _events: KeyboardEvent[];

  constructor() {
    // Initialize listener on web only

    if (Platform.OS !== 'web') {
      throw new Error('Keyboard shortcuts are only supported on web.');
    }

    // Initialize events
    this._events = [];

    // Register event listeners
    this.registerEventListeners();
  }

  /**
   * Register the event listeners and call the appropriate action.
   */
  private registerEventListeners() {
    let keysBeingPressed: string[] = [];

    window.document.addEventListener('keydown', (e) => {
      // Store only unique keys
      if (keysBeingPressed.includes(e.key)) {
        return;
      }

      keysBeingPressed.push(e.key);
      // console.log(keysBeingPressed);

      // Check if array matches pattern in events
      const events = this._events.filter(
        (value) => value.keys.toString() === keysBeingPressed.toString(),
      );
      // console.log(this._events);
      if (events.length > 0) {
        e.preventDefault();
        // Execute the action
        events[0].action();
      }
    });

    window.document.addEventListener('keyup', () => {
      // Clear the entire array
      keysBeingPressed = [];
    });
  }

  // Getters
  /**
   * Get the currently set keyboard events.
   */
  get events() {
    return this._events;
  }

  // Setters
  /**
   * Register a new keyboard event.
   * @param event
   * @returns Unsubscribe method to remove the event.
   */
  registerEvent(event: KeyboardEvent) {
    // Check if key combination is already registered
    if (this._events.find((searchEvent) => event.keys === searchEvent.keys)) {
      // throw new Error(`Key combination ${event.keys} is already registered.`);
      return () => {};
    }

    this._events.push(event);

    // Return method to unsubscribe event
    return () => {
      // Find index
      const index = this._events.findIndex((value) => value.keys === event.keys);

      if (index !== -1) {
        // Remove it from events
        this._events.splice(index, 1);
      }
    };
  }

  /**
   * Deregister a keyboard event.
   * Note that if calling the re-register method later, deregistration should
   * only happen within the component where initialized.
   * @param keys Key combination to remove.
   * @returns Method that re-registers the event.
   */
  deregisterEvent(keys: string[]) {
    const index = this._events.findIndex((event) => event.keys === keys);

    // Remove the event
    if (index > -1) {
      const eventAction = this._events[index].action;
      this._events.splice(index, 1);

      // Re-register if method called
      return () => {
        this._events.push({
          action: eventAction,
          keys,
        });
      };
    }

    return () => {};
  }

  /**
   * Deregister all registered events.
   * @returns Method that re-registers all events.
   */
  deregisterAll() {
    if (this._events.length > 0) {
      const events = this._events.slice();
      this._events = [];

      return () => {
        // Re-register all events
        events.forEach((event) => {
          this.registerEvent(event);
        });
      };
    }

    return () => {};
  }
}

export default KeyboardShortcutManager;
