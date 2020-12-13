export default class EventObserver {

	constructor () {
		this._isObserving = false;
		this._observers = [];
	}

	lock = () => {
		this._isObserving = true;
	}

	unlock = () => {
		this._isObserving = false;
		this._observers.length = 0;
	}

	isLocked = () => {
		return this._isObserving;
	}

	subscribe = (fn) => {
		this._observers.push(fn);
	}

	unsubscribe = (fn) => {
		this._observers = this._observers.filter(subscriber => subscriber !== fn);
	}

	broadcast = (data) => {
		this._observers.forEach(subscriber => subscriber(data));
	}
}
