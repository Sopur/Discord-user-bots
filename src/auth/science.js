/**
 *
 *  ## OVERVIEW
 *
 *  A class for handling Discord's science (tracking) system.
 *
 */

const { rrandom } = require("./util");

class EventNode {
    constructor(clientData, type) {
        this.type = type;
        this.properties = {
            client_track_timestamp: 0,
            client_heartbeat_session_id: clientData.sessionID,
            client_uuid: clientData.generateUUID(),
            client_send_timestamp: 0,
        };
    }
}

class ScienceBody {
    constructor(clientData) {
        this.clientData = clientData;
        this.body = {
            events: [],
        };
    }

    eventView(type, page_name, previous_page_name, previous_link_location, has_session) {
        let node = new EventNode(this.clientData, type);
        node.properties.page_name = page_name;
        node.properties.previous_page_name = previous_page_name;
        node.properties.previous_link_location = previous_link_location;
        node.properties.has_session = has_session;
        this.body.events.push(node);
        return this;
    }

    userTriggered(type, name, revision, bucket, population) {
        let node = new EventNode(this.clientData, type);
        node.properties.name = name;
        node.properties.revision = revision;
        node.properties.bucket = bucket;
        node.properties.population = population;
        this.body.events.push(node);
        return this;
    }

    eventClick(type, buttonstate, page_name) {
        let node = new EventNode(this.clientData, type);
        node.properties.buttonstate = buttonstate;
        node.properties.page_name = page_name;
        this.body.events.push(node);
        return this;
    }

    export() {
        let timeSent = Date.now();
        let delay = rrandom(1000, 2000);
        let delayIt = delay / this.body.events.length;
        for (let i = 0; i < this.body.events.length; i++) {
            let event = this.body.events[i];
            let invIt = this.body.events.length - i;
            event.properties.client_track_timestamp = Math.floor(timeSent - delayIt * invIt) + rrandom(-10, 10);
            event.properties.client_send_timestamp = timeSent;
        }
        return this.body;
    }
}

module.exports = ScienceBody;
