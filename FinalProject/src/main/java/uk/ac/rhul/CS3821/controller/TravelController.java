package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    static class Node { String id; Node(String id){this.id=id;} }
    static class Edge { String from,to; double cost; Edge(String f,String t,double c){from=f;to=t;cost=c;} }
    static class Graph {
        Map<String,Node> nodes=new HashMap<>();
        Map<String,List<Edge>> adj=new HashMap<>();
        void addNode(Node n){nodes.put(n.id,n);adj.putIfAbsent(n.id,new ArrayList<>());}
        void addEdge(Edge e){adj.get(e.from).add(e);}
        List<Edge> edges(String id){return adj.getOrDefault(id,List.of());}
    }
    static class Route { List<String> path; double cost; Route(List<String> p,double c){path=p;cost=c;} }

    // --- Dijkstra only ---
    static Route dijkstra(Graph g,String start,String goal){
        Map<String,Double> dist=new HashMap<>();
        Map<String,String> prev=new HashMap<>();
        for(String id:g.nodes.keySet()) dist.put(id,Double.POSITIVE_INFINITY);
        dist.put(start,0.0);
        PriorityQueue<String> pq=new PriorityQueue<>(Comparator.comparingDouble(dist::get));
        pq.add(start);
        while(!pq.isEmpty()){
            String cur=pq.poll();
            if(cur.equals(goal)) return reconstruct(prev,cur,dist.get(cur));
            for(Edge e:g.edges(cur)){
                double alt=dist.get(cur)+e.cost;
                if(alt<dist.getOrDefault(e.to,Double.POSITIVE_INFINITY)){
                    dist.put(e.to,alt); prev.put(e.to,cur); pq.add(e.to);
                }
            }
        }
        return new Route(List.of(),Double.POSITIVE_INFINITY);
    }
    static Route reconstruct(Map<String,String> prev,String goal,double cost){
        List<String> path=new ArrayList<>(); String cur=goal;
        while(cur!=null){path.add(cur);cur=prev.get(cur);} Collections.reverse(path);
        return new Route(path,cost);
    }

    @GetMapping("/route")
    public ResponseEntity<?> route(@RequestParam String start,@RequestParam String goal){
        Graph g=new Graph();
        g.addNode(new Node("STADIUM"));
        g.addNode(new Node("SEVEN_SISTERS"));
        g.addNode(new Node("LIV_ST_INTERCHANGE"));
        g.addNode(new Node("MILTON_KEYNES"));

        g.addEdge(new Edge("STADIUM","SEVEN_SISTERS",20));
        g.addEdge(new Edge("SEVEN_SISTERS","LIV_ST_INTERCHANGE",18));
        g.addEdge(new Edge("LIV_ST_INTERCHANGE","MILTON_KEYNES",60));
        g.addEdge(new Edge("STADIUM","LIV_ST_INTERCHANGE",35));
        g.addEdge(new Edge("SEVEN_SISTERS","MILTON_KEYNES",80));

        Route r=dijkstra(g,start,goal);
        return ResponseEntity.ok(Map.of("nodes",r.path,"totalCostMinutes",r.cost,"algorithm","DIJKSTRA"));
    }
}