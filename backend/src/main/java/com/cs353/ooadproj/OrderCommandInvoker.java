package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Invoker for order commands with history tracking
 * Part of the Command pattern implementation that maintains command history
 */
@Service
@Slf4j
public class OrderCommandInvoker {
    private final Deque<OrderCommand> history = new ArrayDeque<>();
    
    /**
     * Execute a command and store it in history
     */
    public void executeCommand(OrderCommand command) {
        if (command == null) {
            log.error("Cannot execute null command");
            throw new IllegalArgumentException("Command cannot be null");
        }
        
        log.info("Executing order command of type: {}", command.getClass().getSimpleName());
        try {
            command.execute();
            history.push(command);
            log.info("Command executed successfully");
        } catch (Exception e) {
            log.error("Error executing command: {}", e.getMessage(), e);
            throw e; // Re-throw to allow controllers to handle
        }
    }
    
    /**
     * Undo the last executed command
     */
    public void undoLastCommand() {
        if (!history.isEmpty()) {
            OrderCommand command = history.pop();
            log.info("Undoing command");
            command.undo();
        } else {
            log.warn("No commands to undo");
        }
    }
}
