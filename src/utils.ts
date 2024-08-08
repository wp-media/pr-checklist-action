export default class Util {

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
    static getUncompletedTasks(body: string): string {
        let responseString = "";

        try {
            const uncheckedTaskPattern = "- [ ]";
            const lines = body.split('\n').map(line => line.trim().replace(/\u00A0/g, ' ')); //Split in lines and sanitize for invisible characters

            // Filter lines that contain the unchecked task pattern
            const uncompletedTasks = lines.filter(line => line.includes(uncheckedTaskPattern));

            if (uncompletedTasks.length > 0) {
                responseString += 'Uncompleted Tasks\n';
                uncompletedTasks.forEach(task => {
                    responseString += `${task}\n`;
                });
            }
        } catch (e) {
            responseString = `Error: ${e.message}`;
        }

        return responseString;
    }
    /**
     * This method will read the input string and match it with check mark([x]).
     * Gets the completed tasks
     * 
     * @param body PR body that has tasks
     * 
     * Returns 
     *  empty string if there are no completed tasks
     *  completed tasks string
     */
    static getCompletedTasks(body: string): string {
        let responseString = "";

        try {
            const checkedTaskPattern = "- [x]";
            const lines = body.split('\n').map(line => line.trim().replace(/\u00A0/g, ' ')); //Split in lines and sanitize for invisible characters

            // Filter lines that contain the unchecked task pattern
            const completedTasks = lines.filter(line => line.includes(checkedTaskPattern));

            if (completedTasks.length > 0) {
                responseString += 'Completed Tasks\n';
                completedTasks.forEach(task => {
                    responseString += `${task}\n`;
                });
            }
        } catch (e) {
            responseString = `Error: ${e.message}`;
        }

        return responseString;
    }
    /**
     * This method will read the input string and match it with check mark([x]).
     * Gets the completed tasks
     * 
     * @param body PR body that has tasks
     * 
     * Returns 
     *  empty string if there are no completed tasks
     *  completed tasks string
     */
    static extractString(body: string, startString: string, endString?: string): string {
        const startIndex = body.indexOf(startString);
        if (startIndex === -1) {
            return '';
        }
        if (endString === undefined) {
            return body.substring(startIndex + startString.length).trim();
        } else {
            const endIndex = body.indexOf(endString, startIndex + startString.length);
            if (endIndex === -1) {
                return '';
            }
            return body.substring(startIndex + startString.length, endIndex).trim();
        }
        
    }
}