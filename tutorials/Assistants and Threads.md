# Notes on Assistant and Threads- local rules

In the configuration object one can set values for assistant and threads
so that they can be reused.

## Assistant

Each instance of assistant has a unique id, However the names of the assistant
are not unique.

To avoid adding the overhead of persisting these id's the library 
has some local rules.

1. If assistandid is specified, it then used to retrieve the session.
(suspect this would be a production scenario)
2. If assistandid is '-1' then search for an assistant with the assistname.
   - If not found drop down to option 3 below and create a new assistant
3. If assistantid is '0' then create a new assistant with the sessionName
   - This might result in mulitple assistants with the same name

During development recommend setting assistantid to -1.

## Thread

To avoid adding the overhead of persisting these id's the library
has some local rules.

1. If threadid is specified, it then used.
(suspect this would be a production scenario)
2. If threadid is '-1', then the threadid saved with the assistant is used.
3. If threadid is '0' then a new thread is created
   - This thread's id saved in the current assistant's metadata.
