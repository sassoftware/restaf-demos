# Notes on Assistant and Threads- local rules

In the configuration object one can set values for assistant and threads
so that they can be reused.

These local rules are to help manage resources($).

In production one expects the assistantid and threadid to be managed
externally and provided in the configuration.

## Assistant

Each instance of assistant has a unique id, However the names of the assistant
are not unique.

To avoid adding the overhead of persisting these id's the library
has some local rules.

1. If assistandid is specified, it then used to retrieve the session.
(suspect this would be a production scenario)
2. If assistandid is 'REUSE' then search for an assistant with the assistname.
   - If not found drop down to option 3 below and create a new assistant
3. If assistantid is 'NEW' then create a new assistant with the sessionName
   - If the assistant with the name exists, it will be deleted
   - This might result in mulitple assistants with the same name

During development recommend setting assistantid to NEW

## Thread

To avoid adding the overhead of persisting these id's the library
has some local rules.

1. If threadid is specified, it then used.
(suspect this would be a production scenario)
2. If threadid is 'REUSE', then the threadid saved with in
    the assistant's metadata will be used.
3. If threadid is 'NEW' then a new thread is created
   - If a there was a threadid saved with the assistant it will be deleted.
   - This new threadid will be saved in the current assistant's metadata.

See the tutorial on Tools and Functions