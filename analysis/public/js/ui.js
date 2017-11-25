'use strict';

// wire up the elements of the UI to various functions.

const MQTT_DEFAULT_HOST= "iot.eclipse.org/ws";
const MQTT_DEFAULT_TOPIC = "rocket_surgery/#";

const STATES = {
    WAITING: 0,
    RUNNING: 1,
    PAUSED: 2,

};

function UI(options) {

    let opts = options || {};

    this.c = {
        host: document.getElementById("hostname"),
        topic: document.getElementById("topic"),
        connect: document.getElementById("connect"),
        state: document.getElementById("state"),
        download: document.getElementById("download"),
        reset: document.getElementById("reset"),
    };

    this.STATES = STATES;
    this.state = STATES.WAITING;

    this.connected = false;
    this.mqtt = {
        host: null,
        topic: null,
    };

    this.reactor = opts.reactor;

    this.event_init();
}

UI.prototype.event_init = function() {
    // sets up all of the event handlers.

    this.c.connect.addEventListener("click", (e) => {
        if (! this.connected) {
            // do the connection
            this.mqtt.host = this.c.host.value || MQTT_DEFAULT_HOST;
            this.mqtt.topic = this.c.topic.value || MQTT_DEFAULT_TOPIC;

            this.reactor.dispatchEvent('connect');
            this.connected = true;
            this.c.connect.textContent = "Disconnect";
        } else {
            // disconnect the service
            this.reactor.dispatchEvent('disconnect');
            this.connected = false;
            this.c.connect.textConnect = "Disconnecting";
        }
    });

    this.c.state.addEventListener("click", (e) => {
        if (this.state == STATES.RUNNING) {
            this.set_state('pause');
        } else if (this.state == STATES.PAUSED) {
            this.set_state('running');
        }
    });

    this.c.reset.addEventListener("click", (e) => {
        this.set_state('pause');
        this.reactor.dispatchEvent("data_reset");
    });
};

UI.prototype.set_state = function(state) {

    if (state == "running") {
        this.state = STATES.RUNNING;
        this.c.state.textContent = "Pause";
        //this.reactor.dispatchEvent('data_running');
    } else if (state == "pause") {
        this.state = STATES.PAUSED;
        this.c.state.textContent = "Resume";
        //this.reactor.dispatchEvent('data_paused');
    } else if (state == "waiting") {
        this.state = STATES.WAITING;
        this.c.state.textContent = "Waiting";
        this.c.connect.textContent = "Connect";
    }
};
