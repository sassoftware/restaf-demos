# Notes on Assistant and Threads- local rules

In the configuration object one can set values for assistant name, assistant id,
threadid and vector store id..

In production one expects the assistantid, threadid and vectorStoreidand threadid
to be savbed externally.

The library follows the following rules - mainly to simplify the development process.

## Basic setup

The following information is saved in the session metadata

- the id of the current thread
- the id of the current vector store

## Assistant

Each instance of assistant has a unique id, However the names of the assistant
are not unique.

To avoid adding the overhead of persisting these id's the library
has some local rules during development.

> During development recommend setting devMode to true.
This way a fresh environment is available for each development
session.

## devMode=true

- If a assistant with the specified assistName exists, it will be deleted.
Its thread and vector store are also be deleted.
- A new assistant, with a new thread and vector store will be created.

## devMode=false

### Assistant

1. If assistantid is specified, it will be reused.
If this assistant is not found, an exception will be thrown.
2. If assistantid is null, then the following will happen:
   - search for assistant with that name
   - if not found, an exception will be thrown

### Thread

To avoid the overhead of persisting the threadid the library
has some local rules.

1. If threadid is specified, it will be used
2. Else if using an existing assistant, then the previous thread will be used.
3. As a last resort, a new thread will be created.

### Vector Store

1. If vectorStoreid is specified, it will be used.
2. Else If using an existing assistant, then the previous vector store will be used.