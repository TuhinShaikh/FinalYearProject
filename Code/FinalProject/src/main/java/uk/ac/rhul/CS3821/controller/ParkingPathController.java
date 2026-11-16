package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.ToDoubleBiFunction;

/**
 * REST controller exposing A* pathfinding for parking navigation.
 */
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

    /**
     * Computes an A* route between two nodes.
     *
     * @param g graph instance
     * @param start start node id
     * @param goal goal node id
     * @param h heuristic function
     * @return computed route
     */
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

    /**
     * Reconstructs an ordered path from predecessor links.
     *
     * @param came predecessor map
     * @param goal goal node id
     * @param cost total route cost
     * @return reconstructed route
     */
    static Route reconstruct(Map<String,String> came,String goal,double cost){
        List<String> path=new ArrayList<>(); String cur=goal;
        while(cur!=null){path.add(cur);cur=came.get(cur);} Collections.reverse(path);
        return new Route(path,cost);
    }

    // I use Manhattan distance because parking slots are arranged as a grid.
    static ToDoubleBiFunction<Node,Node> manhattan = (n,g)->Math.abs(n.x-g.x)+Math.abs(n.y-g.y);

    /**
     * Returns a path between parking nodes using a demo 3x3 graph.
     *
     * @param start start node id
     * @param goal goal node id
     * @return route payload containing node sequence and step count
     */
    @GetMapping("/path")
    public ResponseEntity<?> path(@RequestParam String start,@RequestParam String goal){
        Graph g=new Graph();
        // I build a small 3x3 grid here because it is easy to verify visually during development.
        for(int i=0;i<3;i++){
            for(int j=0;j<3;j++){
                String id="S"+i+j;
                g.addNode(new Node(id,i,j));
            }
        }
        // I connect neighboring slots only, which matches real movement between adjacent spaces.
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