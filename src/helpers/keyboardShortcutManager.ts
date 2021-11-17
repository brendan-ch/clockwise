import { Platform } from 'react-native';

interface KeyboardEvent {
  /**
   * Ordered keys in a combination (as determined from DOM).
   */
  keys: string[],
  /**
   * Action to run on the key combination
   */
  action: () => {},
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
  registerEventListeners() {
    let keysBeingPressed: string[] = [];

    window.document.addEventListener('keydown', (e) => {
      // Store only unique keys
      if (keysBeingPressed.includes(e.key)) {
        return;
      }

      keysBeingPressed.push(e.key);

      // Check if array matches pattern in events
      const events = this._events.filter((value) => value.keys === keysBeingPressed);
      if (events.length > 0) {
        e.preventDefault();
        // Execute the action
        events[0].action();
      }

      console.log(`Keys being pressed: ${keysBeingPressed}`);
    });

    window.document.addEventListener('keyup', () => {
      // Clear the entire array
      keysBeingPressed = [];
      console.log('Keys array cleared');
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
    if (this._events.filter((searchEvent) => event.keys === searchEvent.keys)) {
      throw new Error(`Key combination ${event.keys} is already registered.`);
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
}

export default KeyboardShortcutManager;
