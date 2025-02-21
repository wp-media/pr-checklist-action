"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const utils_1 = require("./utils");
/**
 * This action will retrieve the PR body and
 * run custom tests. If one of them fails,
 * the action fails and returns immediately.
 */
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // read the pr body for tasks
            const prBody = (_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.body;
            if (!prBody) {
                core.info("PR does not have a body.");
                return;
            }
            // Ensure Description is modified
            let descriptionExists = utils_1.default.checkSectionModified('Description', prBody, "# Description", "## Type of change", ['Fixes #(issue number)', '*Explain how this code impacts users.*']);
            if (!descriptionExists) {
                core.setFailed(`Description not set."`);
                return;
            }
            // Ensure Type of change is selected
            core.debug('Checking Type of Change...');
            let startString = "## Type of change";
            let endString = "## Detailed scenario";
            const typeOfChangePortion = utils_1.default.extractString(prBody, startString, endString);
            core.debug(typeOfChangePortion);
            if (!typeOfChangePortion) {
                core.setFailed(`Type of change section not found.`);
                return;
            }
            // get ticked tasks
            core.debug('Getting a list of ticked tasks: ');
            let typeOfChange = utils_1.default.getCompletedTasks(typeOfChangePortion);
            core.debug(typeOfChange);
            let isCheckPassed = false;
            if (typeOfChange) {
                isCheckPassed = true;
            }
            if (!isCheckPassed) {
                core.setFailed(`Type of change not selected: "${typeOfChangePortion}"`);
                return;
            }
            if (typeOfChange.includes('Release')) {
                core.info("This is a release PR. The only mandatory check is the Description, which passed.");
                return;
            }
            if (typeOfChange.includes('Chore')) {
                core.info("This is a chore PR. The only mandatory check is the Description, which passed.");
                return;
            }
            // Ensure Detailed Scenario part is modified
            let whattestedExists = utils_1.default.checkSectionModified('What was tested', prBody, "### What was tested", "### How to test");
            if (!whattestedExists) {
                core.setFailed(`Detailed scenario not set."`);
                return;
            }
            let howtestExists = utils_1.default.checkSectionModified('What was tested', prBody, "### How to test", "## Technical description");
            if (!howtestExists) {
                core.setFailed(`Detailed scenario not set."`);
                return;
            }
            // Ensure Documentation is modified
            let documentationExists = utils_1.default.checkSectionModified('Documentation', prBody, "### Documentation", "### New dependencies");
            if (!documentationExists) {
                core.setFailed(`Documentation not set."`);
                return;
            }
            // Ensure Checklist is completed
            // Opt-out of mandatory checklist if a justification is provided
            let untickedJustificationExists = utils_1.default.checkSectionModified('Unticked items justification', prBody, "## Unticked items justification", "# Additional Checks", ['*If some mandatory items are not relevant, explain why in this section.*']);
            if (untickedJustificationExists) {
                core.info(`Unticked items justification is provided, the mandatory checklist verification is skipped."`);
            }
            if (!untickedJustificationExists) {
                core.debug('Checking Mandatory Checklist...');
                startString = "# Mandatory Checklist";
                endString = "# Additional Checks";
                const checklistPortion = utils_1.default.extractString(prBody, startString, endString);
                core.debug(checklistPortion);
                if (!checklistPortion) {
                    core.setFailed(`Checklist section not found.`);
                    return;
                }
                // get unticked tasks
                core.debug('Getting a list of unticked tasks: ');
                let uncompletedTasks = utils_1.default.getUncompletedTasks(checklistPortion);
                core.debug(uncompletedTasks);
                isCheckPassed = false;
                if (!uncompletedTasks) {
                    isCheckPassed = true;
                }
                if (!isCheckPassed) {
                    core.setFailed(`Checklist not completed: "${uncompletedTasks}"`);
                    return;
                }
            }
            core.info(`SUCCESS: All checks passed.`);
            return;
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
