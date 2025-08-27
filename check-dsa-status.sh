#!/bin/bash

# Script to identify all placeholder visualization pages that need to be implemented

echo "=== IDENTIFYING PLACEHOLDER DSA VISUALIZATIONS ==="
echo ""

# Array for tracking found placeholder pages
placeholder_files=()

# Check arrays category
echo "1. ARRAYS & SORTING ALGORITHMS:"
for algo in "heap-sort" "selection-sort" "insertion-sort" "linear-search"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/arrays/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

# Check trees category
echo ""
echo "2. TREES:"
for algo in "binary-tree" "binary-search-tree" "avl-tree" "heap" "traversals" "red-black-tree"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/trees/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

# Check linked lists category
echo ""
echo "3. LINKED LISTS:"
for algo in "singly-linked-list" "doubly-linked-list" "circular-linked-list"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/linked-lists/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

# Check stacks & queues category
echo ""
echo "4. STACKS & QUEUES:"
for algo in "stack" "queue" "priority-queue" "deque"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/stacks-queues/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

# Check graphs category
echo ""
echo "5. GRAPHS:"
for algo in "depth-first-search" "breadth-first-search" "dijkstra-algorithm" "kruskal-algorithm" "prim-algorithm" "floyd-warshall-algorithm"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/graphs/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

# Check dynamic programming category
echo ""
echo "6. DYNAMIC PROGRAMMING:"
for algo in "knapsack-01" "longest-common-subsequence" "fibonacci" "coin-change" "edit-distance"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/dynamic-programming/$algo/page.js"
    if [ -f "$file" ]; then
        if grep -q "Under Development\|Coming Soon" "$file"; then
            echo "   ❌ $algo - PLACEHOLDER"
            placeholder_files+=("$file")
        else
            echo "   ✅ $algo - COMPLETE"
        fi
    else
        echo "   ❓ $algo - FILE MISSING"
    fi
done

echo ""
echo "=== SUMMARY ==="
echo "Total placeholder files found: ${#placeholder_files[@]}"
echo ""

if [ ${#placeholder_files[@]} -gt 0 ]; then
    echo "Placeholder files that need implementation:"
    for file in "${placeholder_files[@]}"; do
        echo "  - $file"
    done
fi

echo ""
echo "=== CHECKING MAIN CATEGORY PAGES ==="

# Check main category pages
categories=("arrays" "trees" "linked-lists" "stacks-queues" "graphs" "dynamic-programming")

for category in "${categories[@]}"; do
    file="/workspaces/UPCODE/app/dsa-visualizer/$category/page.js"
    if [ -f "$file" ]; then
        echo "✅ $category main page exists"
    else
        echo "❌ $category main page MISSING"
    fi
done
