package com.cs353.ooadproj;

/**
 * Command interface for order operations
 * Demonstrates the Command pattern by encapsulating a request as an object
 */
public interface OrderCommand {
    void execute();
    void undo();
}
