const cote = require('cote');

class JSONSet extends Set {
    toJSON() {
        return [...this];
    }
}

class Kotelett {
    constructor() {
        this.messages = new JSONSet();
        this.responder = null;
        this.requester = null;
    }

    on(type) {
        if (!this.responder)
            this.responder = new cote.Responder({ name: `Responder ${type}` });

        this.responder.advertisement.messages = this.responder.advertisement.messages || new JSONSet();
        this.responder.advertisement.messages.add(type);
        this.responder.on(...arguments);
        console.log(this.responder.advertisement)

    }

    onAdded(obj) {
        if (this.pendingConnection.has(obj.id)) return;
        if (!obj.advertisement.messages.some(m => this.messages.has(m))) return

        var address = cote.Requester.useHostNames ? obj.hostName : obj.address;

        var alreadyConnected = this.sock.socks.some((s) => {
            return (cote.Requester.useHostNames ? s._host == obj.hostName : s.remoteAddress == address) && s.remotePort == obj.advertisement.port;
        });

        if (alreadyConnected) return;

        this.pendingConnection.add(obj.id);

        console.log(`connecting to ${obj.advertisement.port}`);
        if (!this.sock.handleErrorsOriginal)
            this.sock.handleErrorsOriginal = this.sock.handleErrors;

        this.sock.handleErrors = (sock) => {
            sock.componentId = obj.id;
            sock.messages = obj.advertisement.messages;
            console.log('adding messages', sock.messages);
            this.sock.handleErrorsOriginal.call(this.sock, sock);
        }
        this.sock.connect(obj.advertisement.port, obj.address, () => this.pendingConnection.delete(obj.id));
    }

    send() {
        if (typeof arguments[0] == 'string')
            arguments[0] = { type: arguments[0] };

        const msg = arguments[0];

        if (!this.requester) {
            this.requester = new cote.Requester({ name: `Requester ${msg.type}` });
            this.requester.onAdded = this.onAdded.bind(this.requester);
            this.requester.messages = this.messages;

            this.requester.sock.send = function(msg) {
                var socks = this.socks.filter(s => s.messages.indexOf(msg.type) > -1);

                var len = socks.length;
                var sock = socks[this.n++ % len];
                var args = [...arguments];

                if (sock) {
                    var hasCallback = 'function' == typeof args[args.length - 1];
                    if (!hasCallback) args.push(function() { });
                    var fn = args.pop();
                    fn.id = this.id();
                    this.callbacks[fn.id] = fn;
                    args.push(fn.id);
                }

                if (sock) {
                    sock.write(this.pack(args));
                } else {
                    // debug('no connected peers');
                    this.enqueue(args);
                }
            }.bind(this.requester.sock);

            this.requester.discovery.on('helloReceived', hello => {
                const sock = this.requester.sock.socks.find(s => s.componentId == hello.id)
                if (!sock) 
                    return this.requester.onAdded(hello)

                if (sock.messages.length != hello.advertisement.messages.length) 
                    console.log('updating messages', sock.messages, hello.advertisement.messages, hello.advertisement.name, hello.id)
                sock.messages = hello.advertisement.messages
            })

            this.requester.pendingConnection = new Set();
        }

        if (!this.messages.has(msg.type)) {
            this.messages.add(msg.type);
            for (let nodeId in this.requester.discovery.nodes) {
                console.log('calling on added new message type')

                this.requester.onAdded(this.requester.discovery.nodes[nodeId]);
            }
        }

        return this.requester.send(...arguments);
    }
}

module.exports = new Kotelett();
