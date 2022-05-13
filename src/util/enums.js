/**
 *
 *  ## OVERVIEW
 *
 *  Specifies IDs as variable names just like C++ enums.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Add the verse order of the IDs pointing to the variable names to be easily debugged.
 *
 */

module.exports = {
    ReadyStates: {
        OFFLINE: 0,
        CONNECTING: 1,
        CONNECTED: 2,

        0: "OFFLINE",
        1: "CONNECTING",
        2: "CONNECTED",
    },
};
