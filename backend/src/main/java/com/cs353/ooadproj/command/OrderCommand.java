package com.cs353.ooadproj.command;

/**
 * Command interface for order operations
 */
public interface OrderCommand {
    void execute();
    void undo();
}
