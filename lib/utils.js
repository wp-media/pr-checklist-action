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
        const regex = /New feature/g;
        const uncompletedTasks = body.match(regex);
        if (undefined != uncompletedTasks) {
            responseString += 'Uncompleted Tasks\n';
            uncompletedTasks.forEach(u => {
                responseString += `${u}\n`;
            });
        }
        return responseString;
    }
}
exports.default = Util;
