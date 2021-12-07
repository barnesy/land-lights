class GeoObserver {

  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.watchID = null
  }

  disconnect() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  observe() {
    if (this.watchID) return

    const success = (position) => this.callback(position, null)
    const failure = (error) => this.callback(null, error)

    this.watchID = navigator.geolocation.watchPosition(success, failure, this.options)
  }
}

export { GeoObserver }
