# SortingVisualization
A JavaScript library and example for visualizing sorting algorithms on the web.

## [Preview on dogacel.net](http://www.dogacel.net/sortvisual)

## How to use ?
![alt text](http://dogacel.net/sortvisual/explanation.png)

## Can I add my own xxx algorithm and visualize ? 
YES ! You can add your own algorithm. All you need to do is add an option for the functionChooser by 

```javascript
functionChooser.child(createElement('option', 'funcName'));
```
funcName must be the name of your function. It must meet the following standarts:
- Have exactly one parameter, array.
- Must be declared async like following:
```javascript
async function funcName(array) { ... }
```
- Must include markers, that represent index of compared data (or anything you like) .
```javascript
await tick(array, ...markers);
```

(NOTE: You can still make function not async and do not include tick functions. But the sorting won't animate if you don't do these.)


### ToDo:

- [x] Generate random datasets in desired range.
- [x] Visualize dataset on the web.
- [x] Animate sorting algorithms.
- [x] Set animation speed and sorting algorithm type (Currently Bubble and Insertion sort)
- [ ] Sound effects.
- [ ] Import or export the data array.
- [ ] Have explanations for the sorting algorithms.
- [ ] Prettify UI design.
- [ ] Mobile view support.
- [ ] Compile utilities into a class and library.
- [ ] Allow user to design his/her own algorithm on the go.
- [ ] Better Animations & Data representations.
- [ ] Add 3D visualizations.


