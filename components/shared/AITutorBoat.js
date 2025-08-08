'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaRobot, FaPaperPlane, FaCode, FaQuestionCircle, 
  FaLightbulb, FaPlay, FaCheckCircle, FaBook, FaChevronDown,
  FaChevronUp, FaMicrophone, FaMicrophoneSlash
} from 'react-icons/fa';

const AITutorBoat = ({ language, isOpen, onClose, onProgressUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Language-specific curriculum
  const curriculum = {
    cpp: {
      name: "C++",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
      lessons: [
        {
          title: "Introduction to C++",
          content: "C++ is a powerful, compiled programming language that supports both procedural and object-oriented programming. It's used for system software, game development, and high-performance applications.",
          code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
          quiz: {
            question: "What header file is needed for input/output operations in C++?",
            options: ["<stdio.h>", "<iostream>", "<string.h>", "<vector>"],
            correct: 1
          }
        },
        {
          title: "Variables and Data Types",
          content: "C++ supports various data types including int, float, double, char, bool, and string. Variables must be declared with their type.",
          code: `int age = 25;
float price = 19.99;
double pi = 3.14159;
char grade = 'A';
bool isActive = true;
string name = "John";`,
          quiz: {
            question: "Which data type would you use to store a decimal number with high precision?",
            options: ["int", "float", "double", "char"],
            correct: 2
          }
        },
        {
          title: "Control Structures",
          content: "C++ provides if-else statements, loops (for, while, do-while), and switch statements for program flow control.",
          code: `// If-else statement
if (score >= 90) {
    cout << "Grade A" << endl;
} else if (score >= 80) {
    cout << "Grade B" << endl;
} else {
    cout << "Grade C" << endl;
}

// For loop
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}`,
          quiz: {
            question: "Which loop executes at least once, even if the condition is false?",
            options: ["for loop", "while loop", "do-while loop", "if statement"],
            correct: 2
          }
        }
      ]
    },
    python: {
      name: "Python",
      icon: "🐍",
      color: "from-green-500 to-yellow-500",
      lessons: [
        {
          title: "Introduction to Python",
          content: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in data science, web development, and automation.",
          code: `# Hello World in Python
print("Hello, World!")

# Python is case-sensitive and uses indentation
name = "Alice"
age = 30
print(f"My name is {name} and I'm {age} years old")`,
          quiz: {
            question: "What function is used to display output in Python?",
            options: ["cout", "printf", "print", "echo"],
            correct: 2
          }
        },
        {
          title: "Variables and Data Types",
          content: "Python is dynamically typed, meaning you don't need to declare variable types. Common types include int, float, str, bool, list, dict, and tuple.",
          code: `# Variables in Python
age = 25              # int
price = 19.99         # float
name = "John"         # string
is_active = True      # boolean
numbers = [1, 2, 3]   # list
person = {"name": "Alice", "age": 30}  # dictionary`,
          quiz: {
            question: "Which data type is used to store key-value pairs in Python?",
            options: ["list", "tuple", "dict", "set"],
            correct: 2
          }
        },
        {
          title: "Control Flow",
          content: "Python uses if-elif-else statements, for and while loops. Indentation is crucial for defining code blocks.",
          code: `# If-elif-else
score = 85
if score >= 90:
    print("Grade A")
elif score >= 80:
    print("Grade B")
else:
    print("Grade C")

# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1`,
          quiz: {
            question: "What is used to define code blocks in Python?",
            options: ["Curly braces {}", "Parentheses ()", "Indentation", "Semicolons ;"],
            correct: 2
          }
        }
      ]
    },
    javascript: {
      name: "JavaScript",
      icon: "⚡",
      color: "from-yellow-400 to-orange-500",
      lessons: [
        {
          title: "Introduction to JavaScript",
          content: "JavaScript is a versatile programming language that runs in browsers and servers. It's essential for web development, enabling interactive websites and modern web applications.",
          code: `// Hello World in JavaScript
console.log("Hello, World!");

// Variables
let name = "John";
const age = 25;
var isStudent = true;

// Function
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Alice"));`,
          quiz: {
            question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
            options: ["var", "let", "const", "function"],
            correct: 1
          }
        },
        {
          title: "Data Types and Objects",
          content: "JavaScript has primitive types (string, number, boolean, null, undefined) and objects (arrays, functions, objects).",
          code: `// Primitive types
let str = "Hello";
let num = 42;
let bool = true;
let nothing = null;
let undef = undefined;

// Objects
let person = {
    name: "Alice",
    age: 30,
    greet: function() {
        return "Hi, I'm " + this.name;
    }
};

// Arrays
let numbers = [1, 2, 3, 4, 5];`,
          quiz: {
            question: "Which of these is NOT a primitive data type in JavaScript?",
            options: ["string", "number", "array", "boolean"],
            correct: 2
          }
        },
        {
          title: "Functions and Scope",
          content: "JavaScript functions are first-class objects. You can create them with function declarations, expressions, or arrow functions.",
          code: `// Function declaration
function add(a, b) {
    return a + b;
}

// Function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function
const divide = (a, b) => a / b;

// Higher-order function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]`,
          quiz: {
            question: "What is the correct syntax for an arrow function?",
            options: ["function => (a, b) { return a + b; }", "(a, b) => { return a + b; }", "=> (a, b) { return a + b; }", "function (a, b) => a + b"],
            correct: 1
          }
        }
      ]
    },
    java: {
      name: "Java",
      icon: "☕",
      color: "from-orange-500 to-red-500",
      lessons: [
        {
          title: "Introduction to Java",
          content: "Java is a class-based, object-oriented programming language designed for platform independence. It's widely used for enterprise applications, Android development, and web services.",
          code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables
        int age = 25;
        String name = "John";
        boolean isStudent = true;
        
        System.out.println("Name: " + name + ", Age: " + age);
    }
}`,
          quiz: {
            question: "What is the entry point of a Java application?",
            options: ["start() method", "begin() method", "main() method", "run() method"],
            correct: 2
          }
        },
        {
          title: "Object-Oriented Programming",
          content: "Java is built around OOP concepts: classes, objects, inheritance, encapsulation, and polymorphism.",
          code: `public class Person {
    private String name;
    private int age;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // Method
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old");
    }
}`,
          quiz: {
            question: "Which access modifier makes a field accessible only within the same class?",
            options: ["public", "protected", "private", "default"],
            correct: 2
          }
        },
        {
          title: "Collections and Generics",
          content: "Java provides powerful collection classes like ArrayList, HashMap, and HashSet. Generics ensure type safety.",
          code: `import java.util.*;

public class CollectionsExample {
    public static void main(String[] args) {
        // ArrayList with generics
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        
        // HashMap
        Map<String, Integer> ages = new HashMap<>();
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        
        // Iterating
        for (String name : names) {
            System.out.println(name + " is " + ages.get(name) + " years old");
        }
    }
}`,
          quiz: {
            question: "What is the purpose of generics in Java?",
            options: ["To improve performance", "To ensure type safety", "To reduce code size", "To enable inheritance"],
            correct: 1
          }
        }
      ]
    },
    c: {
      name: "C",
      icon: "🔧",
      color: "from-gray-500 to-blue-500",
      lessons: [
        {
          title: "Introduction to C",
          content: "C is a general-purpose, procedural programming language that provides low-level access to memory and requires minimal runtime support.",
          code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Variables
    int age = 25;
    float price = 19.99;
    char grade = 'A';
    
    printf("Age: %d, Price: %.2f, Grade: %c\\n", age, price, grade);
    
    return 0;
}`,
          quiz: {
            question: "Which header file is required for input/output functions in C?",
            options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<math.h>"],
            correct: 1
          }
        },
        {
          title: "Pointers and Memory",
          content: "Pointers are variables that store memory addresses. They provide direct access to memory and enable dynamic memory allocation.",
          code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int num = 42;
    int *ptr = &num;  // Pointer to num
    
    printf("Value: %d\\n", num);
    printf("Address: %p\\n", (void*)&num);
    printf("Pointer value: %p\\n", (void*)ptr);
    printf("Value via pointer: %d\\n", *ptr);
    
    // Dynamic memory allocation
    int *arr = malloc(5 * sizeof(int));
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }
    
    free(arr);  // Always free allocated memory
    return 0;
}`,
          quiz: {
            question: "What operator is used to get the address of a variable in C?",
            options: ["*", "&", "->", "%"],
            correct: 1
          }
        },
        {
          title: "Functions and Arrays",
          content: "Functions in C must be declared before use. Arrays are collections of elements of the same type stored in contiguous memory.",
          code: `#include <stdio.h>

// Function declaration
int findMax(int arr[], int size);

int main() {
    int numbers[] = {3, 7, 1, 9, 4};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    int max = findMax(numbers, size);
    printf("Maximum value: %d\\n", max);
    
    return 0;
}

// Function definition
int findMax(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
          quiz: {
            question: "How do you calculate the number of elements in an array in C?",
            options: ["array.length", "sizeof(array)", "sizeof(array) / sizeof(array[0])", "length(array)"],
            correct: 2
          }
        }
      ]
    },
    rust: {
      name: "Rust",
      icon: "🦀",
      color: "from-orange-600 to-red-600",
      lessons: [
        {
          title: "Introduction to Rust",
          content: "Rust is a systems programming language focused on safety, speed, and concurrency. It prevents common programming errors through its ownership system.",
          code: `fn main() {
    println!("Hello, World!");
    
    // Variables (immutable by default)
    let name = "Alice";
    let age = 30;
    
    // Mutable variable
    let mut count = 0;
    count += 1;
    
    println!("Name: {}, Age: {}, Count: {}", name, age, count);
}`,
          quiz: {
            question: "By default, variables in Rust are:",
            options: ["Mutable", "Immutable", "Constant", "Static"],
            correct: 1
          }
        },
        {
          title: "Ownership and Borrowing",
          content: "Rust's ownership system manages memory automatically without garbage collection. Each value has a single owner, and borrowing allows temporary access.",
          code: `fn main() {
    // Ownership
    let s1 = String::from("Hello");
    let s2 = s1; // s1 is moved to s2, s1 is no longer valid
    
    // Borrowing
    let s3 = String::from("World");
    let len = calculate_length(&s3); // Borrowing s3
    println!("The length of '{}' is {}.", s3, len);
    
    // Mutable borrowing
    let mut s4 = String::from("Hello");
    change(&mut s4);
    println!("{}", s4);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but it doesn't drop the value

fn change(some_string: &mut String) {
    some_string.push_str(", World!");
}`,
          quiz: {
            question: "What happens when you assign one variable to another in Rust?",
            options: ["The value is copied", "The value is moved", "Both variables point to the same memory", "An error occurs"],
            correct: 1
          }
        },
        {
          title: "Structs and Enums",
          content: "Structs group related data together, while enums define types that can be one of several variants. Both are fundamental to Rust programming.",
          code: `// Struct definition
struct Person {
    name: String,
    age: u32,
}

// Enum definition
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Person {
    // Method
    fn introduce(&self) {
        println!("Hi, I'm {} and I'm {} years old", self.name, self.age);
    }
    
    // Associated function
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
}

fn main() {
    let person = Person::new(String::from("Alice"), 30);
    person.introduce();
    
    let msg = Message::Write(String::from("Hello, Rust!"));
    process_message(msg);
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Quit message"),
        Message::Write(text) => println!("Text message: {}", text),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::ChangeColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
    }
}`,
          quiz: {
            question: "Which keyword is used to match on enum variants in Rust?",
            options: ["switch", "case", "match", "if"],
            correct: 2
          }
        }
      ]
    },
    go: {
      name: "Go",
      icon: "🐹",
      color: "from-cyan-500 to-blue-500",
      lessons: [
        {
          title: "Introduction to Go",
          content: "Go is a statically typed, compiled language designed for simplicity and efficiency. It excels at concurrent programming and building scalable systems.",
          code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Variables
    var name string = "Alice"
    var age int = 30
    isActive := true  // Short declaration
    
    fmt.Printf("Name: %s, Age: %d, Active: %t\\n", name, age, isActive)
}`,
          quiz: {
            question: "What is the short variable declaration syntax in Go?",
            options: ["var x = 5", "x := 5", "let x = 5", "x = 5"],
            correct: 1
          }
        },
        {
          title: "Goroutines and Channels",
          content: "Go's concurrency model is built around goroutines (lightweight threads) and channels for communication between them.",
          code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d started job %d\\n", id, j)
        time.Sleep(time.Second)
        fmt.Printf("Worker %d finished job %d\\n", id, j)
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    
    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send work
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= numJobs; a++ {
        <-results
    }
}`,
          quiz: {
            question: "What keyword is used to start a goroutine in Go?",
            options: ["async", "thread", "go", "concurrent"],
            correct: 2
          }
        },
        {
          title: "Structs and Interfaces",
          content: "Go uses structs for data grouping and interfaces for defining method sets. Interfaces are implemented implicitly.",
          code: `package main

import "fmt"

// Interface
type Speaker interface {
    Speak() string
}

// Structs
type Person struct {
    Name string
    Age  int
}

type Dog struct {
    Name  string
    Breed string
}

// Methods
func (p Person) Speak() string {
    return "Hello, I'm " + p.Name
}

func (d Dog) Speak() string {
    return "Woof! I'm " + d.Name
}

func main() {
    person := Person{Name: "Alice", Age: 30}
    dog := Dog{Name: "Buddy", Breed: "Golden Retriever"}
    
    speakers := []Speaker{person, dog}
    
    for _, speaker := range speakers {
        fmt.Println(speaker.Speak())
    }
}`,
          quiz: {
            question: "How are interfaces implemented in Go?",
            options: ["Explicitly with 'implements' keyword", "Implicitly by implementing methods", "Through inheritance", "Using abstract classes"],
            correct: 1
          }
        }
      ]
    },
    solidity: {
      name: "Solidity",
      icon: "💎",
      color: "from-purple-500 to-pink-500",
      lessons: [
        {
          title: "Introduction to Solidity",
          content: "Solidity is a statically typed programming language for developing smart contracts on Ethereum and other blockchain platforms.",
          code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor() {
        message = "Hello, Blockchain World!";
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`,
          quiz: {
            question: "What is the purpose of the 'pragma' directive in Solidity?",
            options: ["To import libraries", "To specify compiler version", "To define visibility", "To set gas limits"],
            correct: 1
          }
        },
        {
          title: "Data Types and State Variables",
          content: "Solidity supports various data types including uint, int, bool, address, bytes, and arrays. State variables are stored on the blockchain.",
          code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataTypes {
    // State variables
    uint256 public totalSupply = 1000000;
    address public owner;
    bool public isActive = true;
    string public name = "MyToken";
    
    mapping(address => uint256) public balances;
    address[] public holders;
    
    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        // Add to holders if new
        if (balances[to] == amount) {
            holders.push(to);
        }
    }
}`,
          quiz: {
            question: "Which data type is used to store Ethereum addresses?",
            options: ["string", "bytes32", "address", "uint160"],
            correct: 2
          }
        },
        {
          title: "Functions and Modifiers",
          content: "Solidity functions can have different visibility (public, private, internal, external) and state mutability (view, pure, payable).",
          code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FunctionsExample {
    address public owner;
    uint256 public value;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    // Payable function
    function deposit() public payable {
        value += msg.value;
    }
    
    // View function (doesn't modify state)
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Pure function (doesn't read or modify state)
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
    
    // Function with modifier
    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        payable(owner).transfer(amount);
    }
    
    // Events
    event Withdrawal(address indexed to, uint256 amount);
    
    function withdrawWithEvent(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }
}`,
          quiz: {
            question: "What does the 'payable' keyword indicate in Solidity?",
            options: ["Function can receive Ether", "Function is expensive", "Function requires payment", "Function returns money"],
            correct: 0
          }
        }
      ]
    },
    csharp: {
      name: "C#",
      icon: "🔷",
      color: "from-blue-500 to-purple-500",
      lessons: [
        {
          title: "Introduction to C#",
          content: "C# is a modern, object-oriented programming language developed by Microsoft. It runs on the .NET framework and is used for desktop, web, and mobile applications.",
          code: `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            
            // Variables
            string name = "Alice";
            int age = 30;
            bool isActive = true;
            
            Console.WriteLine($"Name: {name}, Age: {age}, Active: {isActive}");
        }
    }
}`,
          quiz: {
            question: "What method is used to display output in C#?",
            options: ["print", "Console.WriteLine", "System.out.println", "echo"],
            correct: 1
          }
        },
        {
          title: "Classes and Objects",
          content: "C# is fully object-oriented. Classes define the structure and behavior of objects, supporting inheritance, polymorphism, and encapsulation.",
          code: `using System;

public class Person
{
    // Properties
    public string Name { get; set; }
    public int Age { get; private set; }
    
    // Constructor
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
    
    // Method
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old");
    }
    
    // Virtual method for inheritance
    public virtual void Work()
    {
        Console.WriteLine($"{Name} is working");
    }
}

public class Developer : Person
{
    public string ProgrammingLanguage { get; set; }
    
    public Developer(string name, int age, string language) : base(name, age)
    {
        ProgrammingLanguage = language;
    }
    
    // Override parent method
    public override void Work()
    {
        Console.WriteLine($"{Name} is coding in {ProgrammingLanguage}");
    }
}

class Program
{
    static void Main()
    {
        Person person = new Person("Alice", 30);
        Developer dev = new Developer("Bob", 25, "C#");
        
        person.Introduce();
        dev.Introduce();
        
        person.Work();
        dev.Work();
    }
}`,
          quiz: {
            question: "Which keyword is used to inherit from a class in C#?",
            options: ["extends", "inherits", ":", "implements"],
            correct: 2
          }
        },
        {
          title: "Collections and LINQ",
          content: "C# provides powerful collection classes and LINQ (Language Integrated Query) for data manipulation.",
          code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        // List collection
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        // Dictionary collection
        Dictionary<string, int> ages = new Dictionary<string, int>
        {
            {"Alice", 25},
            {"Bob", 30},
            {"Charlie", 35}
        };
        
        // LINQ queries
        var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();
        var squares = numbers.Select(n => n * n).ToList();
        var sum = numbers.Sum();
        var average = numbers.Average();
        
        Console.WriteLine($"Even numbers: {string.Join(", ", evenNumbers)}");
        Console.WriteLine($"Squares: {string.Join(", ", squares)}");
        Console.WriteLine($"Sum: {sum}, Average: {average:F2}");
        
        // Complex LINQ query
        var adults = ages.Where(kvp => kvp.Value >= 30)
                        .Select(kvp => kvp.Key)
                        .OrderBy(name => name);
        
        Console.WriteLine($"Adults: {string.Join(", ", adults)}");
    }
}`,
          quiz: {
            question: "What does LINQ stand for in C#?",
            options: ["Language Integrated Query", "Linear Query", "List Integration Query", "Logic Integrated Query"],
            correct: 0
          }
        }
      ]
    }
  };

  const currentCurriculum = curriculum[language] || curriculum.javascript;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `🚢 Welcome aboard the ${currentCurriculum.name} Learning Ship! I'm Captain AI, your programming tutor. Let's embark on an exciting journey to master ${currentCurriculum.name}!`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      
      setTimeout(() => {
        startLesson(0);
      }, 1500);
    }
  }, [isOpen, language]);

  const startLesson = (lessonIndex) => {
    if (lessonIndex >= currentCurriculum.lessons.length) {
      const completionMessage = {
        id: Date.now(),
        type: 'bot',
        content: `🎉 Congratulations! You've completed the ${currentCurriculum.name} course! Your final score is ${score}/${currentCurriculum.lessons.length}. Ready to start building amazing projects?`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, completionMessage]);
      updateProgress();
      return;
    }

    const lesson = currentCurriculum.lessons[lessonIndex];
    setCurrentLesson(lessonIndex);
    setIsTyping(true);
    
    setTimeout(() => {
      const lessonMessage = {
        id: Date.now(),
        type: 'bot',
        content: lesson.content,
        title: `📚 Lesson ${lessonIndex + 1}: ${lesson.title}`,
        code: lesson.code,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, lessonMessage]);
      setIsTyping(false);
      
      setTimeout(() => {
        const actionMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: "Would you like to take a quick quiz on this topic, or do you have any questions?",
          actions: [
            { text: "📝 Take Quiz", action: () => startQuiz(lesson.quiz) },
            { text: "❓ Ask Question", action: () => setCurrentInput("I have a question about ") },
            { text: "➡️ Next Lesson", action: () => startLesson(lessonIndex + 1) }
          ],
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, actionMessage]);
      }, 1000);
    }, 2000);
  };

  const startQuiz = (quiz) => {
    setQuizMode(true);
    setCurrentQuiz(quiz);
    
    const quizMessage = {
      id: Date.now(),
      type: 'quiz',
      content: quiz.question,
      options: quiz.options,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, quizMessage]);
  };

  const handleQuizAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuiz.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCompletedLessons(prev => new Set([...prev, currentLesson]));
    }
    
    const resultMessage = {
      id: Date.now(),
      type: 'bot',
      content: isCorrect 
        ? "🎉 Correct! Great job understanding the concept!" 
        : `❌ Not quite right. The correct answer is: ${currentQuiz.options[currentQuiz.correct]}`,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, resultMessage]);
    setQuizMode(false);
    setCurrentQuiz(null);
    
    setTimeout(() => {
      updateProgress();
      startLesson(currentLesson + 1);
    }, 2000);
  };

  const updateProgress = () => {
    const progress = Math.round((completedLessons.size / currentCurriculum.lessons.length) * 100);
    onProgressUpdate(progress);
  };

  const sendMessage = () => {
    if (!currentInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Let me explain that concept in more detail...",
        "That's an excellent point! In " + currentCurriculum.name + ", we handle that like this...",
        "I see what you're asking. Here's a practical example...",
        "Wonderful curiosity! That's exactly the kind of thinking that makes a great programmer!"
      ];
      
      const response = {
        id: Date.now() + 1,
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ rotateY: -90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={`relative w-full max-w-4xl h-[80vh] bg-gradient-to-br ${currentCurriculum.color} p-1 rounded-3xl shadow-2xl`}
          onClick={e => e.stopPropagation()}
        >
          {/* Boat Design Container */}
          <div className="relative w-full h-full bg-slate-900/95 rounded-3xl overflow-hidden">
            {/* Boat Header */}
            <div className="relative p-6 border-b border-gray-700/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <FaTimes className="text-white text-xl" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className={`text-4xl p-3 rounded-2xl bg-gradient-to-r ${currentCurriculum.color}`}>
                  {currentCurriculum.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    🚢 {currentCurriculum.name} Learning Ship
                  </h2>
                  <p className="text-gray-300">Captain AI - Your Programming Tutor</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Course Progress</span>
                  <span>{Math.round((completedLessons.size / currentCurriculum.lessons.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-full bg-gradient-to-r ${currentCurriculum.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(completedLessons.size / currentCurriculum.lessons.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className={`p-4 overflow-y-auto transition-all duration-300 ${isExpanded ? 'h-[calc(100%-200px)]' : 'h-[calc(100%-120px)]'}`}>
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'quiz'
                      ? 'bg-purple-600/20 border border-purple-500/50'
                      : 'bg-gray-800 text-white'
                  }`}>
                    {message.title && (
                      <h4 className="font-bold text-lg mb-2 text-yellow-400">{message.title}</h4>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Code Block */}
                    {message.code && (
                      <div className="mt-3 p-3 bg-black/50 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre className="text-green-400">{message.code}</pre>
                      </div>
                    )}
                    
                    {/* Quiz Options */}
                    {message.type === 'quiz' && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            className="w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {message.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className={`px-4 py-2 bg-gradient-to-r ${currentCurriculum.color} text-white rounded-lg hover:scale-105 transition-transform`}
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mt-2">{message.timestamp}</div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-800 text-white p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/50 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about programming..."
                    className="w-full p-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={isExpanded ? 3 : 1}
                  />
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                  </button>
                </div>
                
                <button
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`p-3 rounded-xl transition-colors ${
                    isVoiceMode 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {isVoiceMode ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!currentInput.trim()}
                  className={`p-3 rounded-xl transition-all ${
                    currentInput.trim()
                      ? `bg-gradient-to-r ${currentCurriculum.color} text-white hover:scale-105`
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AITutorBoat;
