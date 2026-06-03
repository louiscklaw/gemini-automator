# new project migration

## background

this is a new project with source code only in `/workspace`

plesae help to accomodate into below tree folder structure.

```tree
$ ls -l /workspace

.
├── 001_documentation
│   └── AGENTS.md
├── 002_docker
│   ├── AGENTS.md
│   ├── client
│   ├── dc_dev.sh
│   ├── dc_prod.sh
│   ├── dc_up.sh
│   ├── docker-compose.dev.yml
│   └── volumes
├── 003_source
│   ├── AGENTS.md
│   ├── client
│   └── server
├── 004_testing
│   └── AGENTS.md
├── 005_tickets
│   ├── AGENTS.md
│   └── helloworld_ticket.md
├── _prompts
│   ├── MEMORY.md
│   ├── OPENCODE_BACKGROUND.md
│   ├── PLAN.md
│   └── TODOs
├── backup.sh
├── AGENTS.md
└── README.md
```

- this is a pilot run of the project. if you do not know the content of the file to create. it doesn't matter and you just create a file as a placeholder is good enough.

- i did the backup. so you can do what you want to re-assemble the project. in worst case user can recover the project and start over again.
