import * as core from '@actions/core'
import * as github from '@actions/github'
import Util from './utils'

/**
 * This action will retrieve the PR body and
 * run custom tests. If one of them fails,
 * the action fails and returns immediately.
 */

async function run(): Promise<void> {

    try {

        // read the pr body for tasks
        const prBody = github.context.payload.pull_request?.body;
        if (!prBody) {
            core.info("PR does not have a body.");
            return
        }

        // Ensure Description is modified
        let descriptionExists = Util.checkSectionModified('Description', prBody, "# Description", "## Type of change", ['Fixes #(issue number)', '*Explain how this code impacts users.*'])
        if(!descriptionExists){
            core.setFailed(`Description not set."`);
            return;
        }

        // Ensure Type of change is selected
        core.debug('Checking Type of Change...');
        let startString = "## Type of change";
        let endString = "## Detailed scenario";
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
        if(typeOfChange.includes('Release')){
            core.info("This is a release PR. The only mandatory check is the Description, which passed.");
            return;
        }
        if(typeOfChange.includes('Chore')){
            core.info("This is a chore PR. The only mandatory check is the Description, which passed.");
            return;
        }


        // Ensure Technical description is modified
        let scenarioExists = Util.checkSectionModified('Detailed scenario', prBody, "## Detailed scenario", "## Technical description")
        if(!scenarioExists){
            core.setFailed(`Detailed scenario not set."`);
            return;
        }
        // Ensure Documentation is modified
        let documentationExists = Util.checkSectionModified('Documentation', prBody, "### Documentation", "### New dependencies")
        if(!documentationExists){
            core.setFailed(`Documentation not set."`);
            return;
        }

        // Ensure Checklist is completed
        // Opt-out of mandatory checklist if a justification is provided
        let untickedJustificationExists = Util.checkSectionModified('Unticked items justification', prBody, "## Unticked items justification", "# Additional Checks", ['*If some mandatory items are not relevant, explain why in this section.*'])
        if(untickedJustificationExists){
            core.info(`Unticked items justification is provided, the mandatory checklist verification is skipped."`);
        }
        if(!untickedJustificationExists){
            core.debug('Checking Mandatory Checklist...');
            startString = "# Mandatory Checklist";
            endString = "# Additional Checks"
            const checklistPortion = Util.extractString(prBody, startString, endString)
            core.debug(checklistPortion);
            if(!checklistPortion) {
                core.setFailed(`Checklist section not found.`);
                return;
            }
            // get unticked tasks
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
        }

        core.info(`SUCCESS: All checks passed.`);
        return;
    } catch (error) {
        core.setFailed(error.message)
    }
}

run();