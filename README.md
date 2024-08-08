# WP Media PR Checklist Action
A GitHub action that performs checks on PR descriptions, according to WP Media PR template from https://github.com/wp-media/.github.

This action runs the following tests:
- Description contains at least one text line that is not the one of the template.
- Documentation contains at least one text line that is not one from the template.
- At least one type of change is set.
- All items in the checklist are ticked.

## Usage

### Create a workflow
```yml
name: 'PR Checklist'
on: 
  pull_request:
    types: [edited, opened, synchronize, reopened]

jobs:
  pr-checklist:
    runs-on: ubuntu-latest
    steps:
      - uses: wp-media/pr-checklist-action@test/adaptation-to-WPMedia-template
        with:
          repo-token: "${{ secrets.PR_CHECKLIST_TOKEN }}"
```

### Token

The PR_CHECKLIST_TOKEN must provide read access to Pull Requests of the repository this action is used in.

### Making the check mandatory to merge

Once the workflow file is commited, you can make the success mandatory before merging through branch protection:
- Require status checks to pass before merging
  - Require branches to be up to date before merging
    - Search and select `pr-checklist`

## Build

Modification to the sources must be done in the `src` folder.
Once the changes are done, `run npm run build && npm run pack` to update the `lib` & `dist` folder.

## :memo: Licence
MIT
