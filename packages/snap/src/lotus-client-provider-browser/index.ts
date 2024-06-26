type CancelSubscriptionCallback = () => void;

export default class BrowserProvider {
    url: string
    wsUrl: any
    httpUrl: any
    importUrl: any
    transport: any
    sendHttpContentType: any
    id: number
    inflight: Map<any, any>
    cancelled: Map<any, any>
    subscriptions: Map<any, any>
    authorizationHeader: any
    WebSocket: any
    fetch: any
    token: any
    connectPromise: any
    ws: any
    destroyed: any
    tokenCallback: any;

    constructor (url: string, options: any) {
      this.url = url
      this.wsUrl =
        options.wsUrl || url.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')
      this.httpUrl =
        options.httpUrl || url.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:')
      this.importUrl =
        options.importUrl || this.httpUrl.replace(/\/rpc\//, '/rest/') + '/import'
      this.transport = options.transport || (url.match(/^http/) ? 'http' : 'ws')
      this.sendHttpContentType = options.sendHttpContentType || 'text/plain;charset=UTF-8'
      this.id = 0
      this.inflight = new Map()
      this.cancelled = new Map()
      this.subscriptions = new Map()
      if (typeof options.token === 'function') {
        this.tokenCallback = options.token
      } else {
        this.token = options.token
        if (this.token && this.token !== '') {
          this.url += `?token=${this.token}`
        }
      }
      this.authorizationHeader = options.authorizationHeader
      this.WebSocket = options.WebSocket || globalThis.WebSocket
      this.fetch = options.fetch || globalThis.fetch.bind(globalThis)
    }
  
    connect (): Promise<void> {
      if (!this.connectPromise) {
        const getConnectPromise = () => {
          return new Promise<void>((resolve, reject) => {
            if (this.transport !== 'ws') return resolve()
            this.ws = new this.WebSocket(this.url)
            // FIXME: reject on error or timeout
            this.ws.onopen = function () {
              resolve()
            }
            this.ws.onerror = function () {
              console.error('ws error')
              reject(new Error('websocket error'))
            }
            this.ws.onmessage = this.receive.bind(this)
          })
        }
        if (this.tokenCallback) {
          const getToken = async () => {
            this.token = await this.tokenCallback()
            delete this.tokenCallback
            if (this.token && this.token !== '') {
              this.url += `?token=${this.token}`
            }
          }
          this.connectPromise = getToken().then(() => getConnectPromise())
        } else {
          this.connectPromise = getConnectPromise()
        }
      }
      return this.connectPromise
    }
  
    send (request: any, schemaMethod: any) {
      const jsonRpcRequest = {
        jsonrpc: '2.0',
        id: this.id++,
        ...request
      }
      if (this.transport === 'ws') {
        return this.sendWs(jsonRpcRequest)
      } else {
        return this.sendHttp(jsonRpcRequest)
      }
    }
  
    async sendHttp (jsonRpcRequest: any): Promise<any> {
      await this.connect()
      const headers = {
        'Content-Type': this.sendHttpContentType,
        Accept: '*/*',
        Authorization: ''
      }
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
      }
      if (this.authorizationHeader) {
        headers.Authorization = this.authorizationHeader
      }
      const response = await this.fetch(this.httpUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsonRpcRequest)
      })
      // FIXME: Check return code, errors
      const { error, result } = await response.json()
      if (error) {
        // FIXME: Return error class with error.code
        throw new Error(error.message)
      }
      return result
    }
  
    sendWs (jsonRpcRequest: any): Promise<any> {
      const promise = new Promise((resolve, reject) => {
        if (this.destroyed) {
          reject(new Error('WebSocket has already been destroyed'))
        }
        this.ws.send(JSON.stringify(jsonRpcRequest))
        // FIXME: Add timeout
        this.inflight.set(jsonRpcRequest.id, (err: any, result: unknown) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
      return promise
    }
  
    sendSubscription (request: any, schemaMethod: any, subscriptionCb: any) : [CancelSubscriptionCallback, Promise<any>] {
      let chanId: null = null
      const json = {
        jsonrpc: '2.0',
        id: this.id++,
        ...request
      }
      if (this.transport !== 'ws') {
        return [
          () => {},
          Promise.reject(
            new Error('Subscriptions only supported for WebSocket transport')
          )
        ]
      }
      const promise = this.connect().then(() => {
        this.ws.send(JSON.stringify(json))
        // FIXME: Add timeout
        return new Promise<void>((resolve, reject) => {
          this.inflight.set(json.id, (err: any, result: null) => {
            chanId = result
            // console.info(`New subscription ${json.id} using channel ${chanId}`)
            this.subscriptions.set(chanId, subscriptionCb)
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      })
      return [cancel.bind(this), promise]
      const that = this
      async function cancel () {
        await promise
        that.inflight.delete(json.id)
        if (chanId !== null) {
            that.subscriptions.delete(chanId)
          await new Promise(resolve => {
            // FIXME: Add timeout
            that.cancelled.set(chanId, {
              cancelledAt: Date.now(),
              closeCb: resolve
            })
            if (!that.destroyed) {
                that.sendWs({
                jsonrpc: '2.0',
                method: 'xrpc.cancel',
                params: [json.id]
              })
            }
          })
          // console.info(`Subscription ${json.id} cancelled, channel ${chanId} closed.`)
        }
      }
    }
  
    receive (event: any): void {
      try {
        const { id, error, result, method, params } = JSON.parse(event.data)
        // FIXME: Check return code, errors
        if (method === 'xrpc.ch.val') {
          // FIXME: Check return code, errors
          const [chanId, data] = params
          const subscriptionCb = this.subscriptions.get(chanId)
          if (subscriptionCb) {
            subscriptionCb(data)
          } else {
            const { cancelledAt } = this.cancelled.get(chanId)
            if (cancelledAt) {
              if (Date.now() - cancelledAt > 2000) {
                console.warn(
                  'Received stale response for cancelled subscription on channel',
                  chanId
                )
              }
            } else {
              console.warn('Could not find subscription for channel', chanId)
            }
          }
        } else if (method === 'xrpc.ch.close') {
          // FIXME: Check return code, errors
          const [chanId] = params
          const { closeCb } = this.cancelled.get(chanId)
          if (!closeCb) {
            console.warn(`Channel ${chanId} was closed before being cancelled`)
          } else {
            // console.info(`Channel ${chanId} was closed, calling callback`)
            closeCb()
          }
        } else {
          const cb = this.inflight.get(id)
          if (cb) {
            this.inflight.delete(id)
            if (error) {
              // FIXME: Return error class with error.code
              return cb(new Error(error.message))
            }
            cb(null, result)
          } else {
            console.warn(`Couldn't find request for ${id}`)
          }
        }
      } catch (e) {
        console.error('RPC receive error', e)
      }
    }
  
    async importFile (body: any): Promise<string> {
      await this.connect()
      const headers = {
        'Content-Type': body.type,
        Accept: '*/*',
        Authorization: `Bearer ${this.token}`
      }
      const response = await this.fetch(this.importUrl, {
        method: 'PUT',
        headers,
        body
      })
      // FIXME: Check return code, errors
      const result = await response.json()
      const {
        Cid: { '/': cid }
      } = result
  
      return cid
    }
  
    async destroy (code = 1000) {
      // List of codes: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
      if (this.ws) {
        this.ws.close(code)
        this.destroyed = true
      }
    }
  }
  