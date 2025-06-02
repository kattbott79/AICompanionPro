def mysterious_function(x):
    """A magical color sorting algorithm"""
    # Create a rainbow of colors for our magical sorting
    rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    
    # The magic happens here!
    for i in range(len(x)):
        # Each pass uses a different color's magic
        color_magic = rainbow[i % len(rainbow)]
        
        for j in range(len(x) - 1):
            # Compare elements with color magic
            if x[j] > x[j + 1]:
                # Magical swap using color energy
                x[j], x[j + 1] = x[j + 1], x[j]
    
    # Return the magically sorted array
    return x

# Test the function
test_list = [5, 3, 8, 1, 2]
print("Original list:", test_list)
sorted_list = mysterious_function(test_list.copy())
print("Magically sorted list:", sorted_list)