# PR TaskList Completed Checker Action
A GitHub action that checks if all tasks are completed in the pull requests.

## Usage

### Create a workflow
```yml
name: 'PR TaskList Completed Checker'
on: 
  pull_request:
    types: [edited, opened, synchronize, reopened]

jobs:
  task-check:
    runs-on: ubuntu-latest
    steps:
      - uses: venkatsarvesh/pr-tasks-completed-action@v1.0.0
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### Check whether tasks are completed
Add a pull request template to your repository (`.github/pull_request_template.md`).

For example: 
```markdown
## Checklist
- [ ] Completed code review
- [ ] Ran unit tests
- [ ] Completed e2e tests
*Delete options that are not relevant.*

- [ ] New feature (non-breaking change which adds functionality).
- [ ] Bug fix (non-breaking change which fixes an issue).
- [ ] Enhancement (non-breaking change which improves an existing functionality).
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as before).
```

Create a pull request that contained tasks list to your repository. This will start a workflow automatically to check whether tasks are completed.

Every update on a pull request will start a new workflow automatically to check pending tasks.

All tasks completed:
![All tasks completed](images/success.png)

Some tasks are still pending:

![Some tasks are still pending](images/failure.png)

You can check a list of uncompleted tasks at the Actions page on clicking Details.
![List of pending tasks](images/pending_tasks.png)


## :memo: Licence
MIT