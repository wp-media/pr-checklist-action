"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    /**
     * This method will read the input string and match it with uncheck mark([ ]).
     * Gets the pending tasks
     *
     * @param body PR body that has tasks
     *
     * Returns
     *  empty string if there are no pending tasks
     *  pending tasks string
     */
    static getPendingTasks(body) {
        let responseString = "";
        try {
            const uncheckedTaskPattern = "[ ]";
            const lines = body.split('\n').map(line => line.trim().replace(/\u00A0/g, ' '));
            // Filter lines that contain the unchecked task pattern
            const uncompletedTasks = lines.filter(line => line.includes(uncheckedTaskPattern));
            if (uncompletedTasks.length > 0) {
                responseString += 'Uncompleted Tasks\n';
                uncompletedTasks.forEach(task => {
                    responseString += `${task}\n`;
                });
            }
            else {
                responseString = `Error: ${lines}`;
            }
        }
        catch (e) {
            responseString = `Error: ${e.message}`;
        }
        return responseString;
    }
}
exports.default = Util;
