package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.ToDoubleBiFunction;

// Offers a simple A* planner so we can trace the best path through the parking grid
@RestController
@RequestMapping("/api/parking")
public class ParkingPathController {

    static class Node { String id; int x,y; Node(String id,int x,int y){this.id=id;this.x=x;this.y=y;} }
    static class Edge { String from,to; double cost; Edge(String f,String t,double c){from=f;to=t;cost=c;} }
    static class Graph {
        Map<String,Node> nodes=new HashMap<>();
        Map<String,List<Edge>> adj=new HashMap<>();
        void addNode(Node n){nodes.put(n.id,n);adj.putIfAbsent(n.id,new ArrayList<>());}
        void addEdge(Edge e){adj.get(e.from).add(e);}
        List<Edge> edges(String id){return adj.getOrDefault(id,List.of());}
    }
    static class Route { List<String> path; double cost; Route(List<String> p,double c){path=p;cost=c;} }

    // --- A* only ---
    // Navigate from start to goal using A* and the provided heuristic
    static Route aStar(Graph g,String start,String goal,ToDoubleBiFunction<Node,Node> h){
        Map<String,Double> gScore=new HashMap<>(),fScore=new HashMap<>();
        Map<String,String> came=new HashMap<>();
        Comparator<String> cmp=Comparator.comparingDouble(x->fScore.getOrDefault(x,Double.POSITIVE_INFINITY));
        PriorityQueue<String> open=new PriorityQueue<>(cmp);
        gScore.put(start,0.0); fScore.put(start,h.applyAsDouble(g.nodes.get(start),g.nodes.get(goal)));
        open.add(start);
        while(!open.isEmpty()){
            String cur=open.poll();
            if(cur.equals(goal)) return reconstruct(came,cur,gScore.get(cur));
            for(Edge e:g.edges(cur)){
                double tentative=gScore.get(cur)+e.cost;
                if(tentative<gScore.getOrDefault(e.to,Double.POSITIVE_INFINITY)){
                    came.put(e.to,cur); gScore.put(e.to,tentative);
                    double hh=h.applyAsDouble(g.nodes.get(e.to),g.nodes.get(goal));
                    fScore.put(e.to,tentative+hh); open.add(e.to);
                }
            }
        }
        return new Route(List.of(),Double.POSITIVE_INFINITY);
    }
    static Route reconstruct(Map<String,String> came,String goal,double cost){
        List<String> path=new ArrayList<>(); String cur=goal;
        while(cur!=null){path.add(cur);cur=came.get(cur);} Collections.reverse(path);
        return new Route(path,cost);
    }

    // Manhattan heuristic for grid
    // Manhattan distance assumes grid-based slots for the estimator
    static ToDoubleBiFunction<Node,Node> manhattan = (n,g)->Math.abs(n.x-g.x)+Math.abs(n.y-g.y);

    // Expose the computed node path and step cost so the frontend can animate a route
    @GetMapping("/path")
    public ResponseEntity<?> path(@RequestParam String start,@RequestParam String goal){
        Graph g=new Graph();
        // Build a small 3x3 parking grid for the demo
        for(int i=0;i<3;i++){
            for(int j=0;j<3;j++){
                String id="S"+i+j;
                g.addNode(new Node(id,i,j));
            }
        }
        // Wire the grid so neighbors are reachable from each other
        for(int i=0;i<3;i++){
            for(int j=0;j<3;j++){
                String id="S"+i+j;
                if(i<2) g.addEdge(new Edge(id,"S"+(i+1)+j,1));
                if(j<2) g.addEdge(new Edge(id,"S"+i+(j+1),1));
            }
        }
        Route r=aStar(g,start,goal,manhattan);
        return ResponseEntity.ok(Map.of("nodes",r.path,"steps",r.cost,"algorithm","A_STAR"));
    }
}