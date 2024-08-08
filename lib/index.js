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
                core.info("PR don't have tasks to check");
                return;
            }
            // Ensure Description is modified
            core.debug('Checking Description...');
            let startString = "# Description";
            let endString = "## Documentation";
            const descriptionPortion = utils_1.default.extractString(prBody, startString, endString);
            core.debug(descriptionPortion);
            if (!descriptionPortion) {
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
                if (trimmedLine.length > 0 && !trimmedLine.startsWith('Fixes #(issue number)')) {
                    descriptionExists = true; // Found a valid line
                    break;
                }
            }
            if (!descriptionExists) {
                core.setFailed(`Description not set: "${descriptionLines}"`);
                return;
            }
            // Ensure Documentation is modified
            core.debug('Checking Documentation...');
            startString = "## Documentation";
            endString = "## Type of change";
            const documentationPortion = utils_1.default.extractString(prBody, startString, endString);
            core.debug(documentationPortion);
            if (!documentationPortion) {
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
                if (trimmedLine.length > 0 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('*')) {
                    documentationExists = true; // Found a valid line
                    break;
                }
            }
            if (!documentationExists) {
                core.setFailed(`Documentation not set: "${documentationLines}"`);
                return;
            }
            // Ensure Type of change is selected
            core.debug('Checking Type of Change...');
            startString = "## Type of change";
            endString = "#";
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
            // Ensure Checklist is compelted
            core.debug('Checking Checklist...');
            startString = "# Checklists";
            const checklistPortion = utils_1.default.extractString(prBody, startString);
            core.debug(checklistPortion);
            if (!checklistPortion) {
                core.setFailed(`Checklist section not found.`);
                return;
            }
            // get ticked tasks
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
            core.info(`SUCCESS: All checks passed.`);
            return;
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
