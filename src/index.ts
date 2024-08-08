import * as core from '@actions/core'
import * as github from '@actions/github'
import Util from './utils'

/**
 * This action will
 * 1. Read the PR body
 * 2. Get all the tasks
 * 3. Checks if all tasks are completed(checked)
 * 4. Return 
 *      success if
 *          there is no pr body 
 *          no tasks in pr body
 *          all tasks are completed(checked) 
 *      failure if 
 *          there are any pending tasks to be complated
 */

async function run(): Promise<void> {

    try {

        // read the pr body for tasks
        const prBody = github.context.payload.pull_request?.body;
        if (!prBody) {
            core.info("PR don't have tasks to check");
            return
        }
        // Ensure Description is modified
        core.debug('Checking Description...');
        let startString = "# Description";
        let endString = "## Documentation";
        const descriptionPortion = Util.extractString(prBody, startString, endString)
        core.debug(descriptionPortion);
        if(!descriptionPortion) {
            core.setFailed(`Description section not found.`);
            return;
        }
        const descriptionLines = descriptionPortion.split('\n').map(line => line.trim().replace(/\u00A0/g, ' ')); //Split in lines and sanitize for invisible character
        let descriptionExists = false;
        // Check each line
        for (const line of descriptionLines) {
            // Trim leading/trailing whitespace
            const trimmedLine = line.trim();
            // Check if the line is not empty and not equal to the template one
            if (trimmedLine.length > 0 && !trimmedLine.startsWith('Fixes #(issue number)') ) {
                descriptionExists = true;  // Found a valid line
                break;
            }
        }
        if(!descriptionExists){
            core.setFailed(`Description not set: "${descriptionLines}"`);
            return;
        }

        // Ensure Documentation is modified
        core.debug('Checking Documentation...');
        startString = "## Documentation";
        endString = "## Type of change";
        const documentationPortion = Util.extractString(prBody, startString, endString)
        core.debug(documentationPortion);
        if(!documentationPortion) {
            core.setFailed(`Documentation section not found.`);
            return;
        }
        const documentationLines = documentationPortion.split('\n').map(line => line.trim().replace(/\u00A0/g, ' ')); //Split in lines and sanitize for invisible character
        let documentationExists = false;
        // Check each line
        for (const line of documentationLines) {
            // Trim leading/trailing whitespace
            const trimmedLine = line.trim();
            // Check if the line is not empty and not equal to the template one
            if (trimmedLine.length > 0 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('*') ) {
                documentationExists = true;  // Found a valid line
                break;
            }
        }
        if(!documentationExists){
            core.setFailed(`Documentation not set: "${documentationLines}"`);
            return;
        }

        // Ensure Type of change is selected
        core.debug('Checking Type of Change...');
        startString = "## Type of change";
        endString = "#";
        const typeOfChangePortion = Util.extractString(prBody, startString, endString)
        core.debug(typeOfChangePortion);
        if(!typeOfChangePortion) {
            core.setFailed(`Type of change section not found.`);
            return;
        }

        // get ticked tasks
        core.debug('Getting a list of ticked tasks: ');
        let typeOfChange = Util.getCompletedTasks(typeOfChangePortion);
        core.debug(typeOfChange);

        let isCheckPassed = false;
        if (typeOfChange) {
            isCheckPassed = true;
        }
        if(!isCheckPassed){
            core.setFailed(`Type of change not selected: "${typeOfChangePortion}"`);
            return;
        }

        // Ensure Checklist is compelted
        core.debug('Checking Checklist...');
        startString = "# Checklists";
        const checklistPortion = Util.extractString(prBody, startString)
        core.debug(checklistPortion);
        if(!checklistPortion) {
            core.setFailed(`Checklist section not found.`);
            return;
        }

        // get ticked tasks
        core.debug('Getting a list of unticked tasks: ');
        let uncompletedTasks = Util.getUncompletedTasks(checklistPortion);
        core.debug(uncompletedTasks);

        isCheckPassed = false;
        if (!uncompletedTasks) {
            isCheckPassed = true;
        }
        if(!isCheckPassed){
            core.setFailed(`Checklist not completed: "${uncompletedTasks}"`);
            return;
        }

        core.info(`SUCCESS: All checks passed.`);
        return;
    } catch (error) {
        core.setFailed(error.message)
    }
}

run();