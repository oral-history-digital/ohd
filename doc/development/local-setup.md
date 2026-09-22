# Local development setup

Use this guide to choose a supported way to run OHD locally. It does not cover
deploying an instance; see [Docker instance setup](../operations/docker_instance_setup.md)
for that task.

## Choose a setup

| If you want to… | Use… |
| --- | --- |
| Develop OHD in Visual Studio Code with the full application stack | [VS Code Dev Containers](devcontainer.md) |
| Run the Docker Compose stack without Dev Containers | [Docker instance setup](../operations/docker_instance_setup.md) |
| Maintain an existing non-container installation | [Manual setup](manual-setup.md) |

For new local development, use VS Code Dev Containers. It provides the Rails
application, database, Solr, and frontend development server together.

## What's next

After the application is running, see [Testing](testing.md) to run the test
suites and [Reindexing](../operations/reindexing.md) when you need to update
search data.
