# Notes on Assistant and Threads- local rules

In the configuration object one can set values for assistant and threads
so that they can be reused.

## Assistant

Each instance of assistant has a unique id, However the names of the assistant
are not unique.

To avoid adding the overhead of persisting these id's the library 
has some local rules.

1. If assistandid is specified, it then used.
(suspect this would be a production scenario)
2. If assistandid is '0' then the assistantName is used.
   - if there is an assistant with that name existing, then that is used.
   - else a new assistant with the same name is created.

## Thread

To avoid adding the overhead of persisting these id's the library
has some local rules.

1. If threadid is specified, it then used.
(suspect this would be a production scenario)
2. If threadid is '-1', then the threadid saved with the assistant is used.
3. If threadid is '0' then a new thread is created
   - This thread's id saved in the current assistant's metadata.
