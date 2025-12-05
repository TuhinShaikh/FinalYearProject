package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.ToDoubleBiFunction;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    // --- Core graph + algorithms in one file ---

    static class Node {
        String id; double lat, lon;
        Node(String id, double lat, double lon) { this.id=id; this.lat=lat; this.lon=lon; }
    }
    static class Edge {
        String from,to; double cost;
        Edge(String f,String t,double c){from=f;to=t;cost=c;}
    }
    static class Graph {
        Map<String,Node> nodes=new HashMap<>();
        Map<String,List<Edge>> adj=new HashMap<>();
        void addNode(Node n){nodes.put(n.id,n);adj.putIfAbsent(n.id,new ArrayList<>());}
        void addEdge(Edge e){adj.get(e.from).add(e);}
        List<Edge> edges(String id){return adj.getOrDefault(id,List.of());}
    }
    static class Route {
        List<String> path; double cost;
        Route(List<String> p,double c){path=p;cost=c;}
    }

    enum Algo { DIJKSTRA, A_STAR }

    static Route route(Graph g,String start,String goal,Algo algo,ToDoubleBiFunction<Node,Node> h){
        Map<String,Double> gScore=new HashMap<>(),fScore=new HashMap<>();
        Map<String,String> came=new HashMap<>();
        Comparator<String> cmp=Comparator.comparingDouble(x->fScore.getOrDefault(x,Double.POSITIVE_INFINITY));
        PriorityQueue<String> open=new PriorityQueue<>(cmp);
        gScore.put(start,0.0); fScore.put(start,(algo==Algo.A_STAR)?h.applyAsDouble(g.nodes.get(start),g.nodes.get(goal)):0.0);
        open.add(start);
        while(!open.isEmpty()){
            String cur=open.poll();
            if(cur.equals(goal)) return reconstruct(came,cur,gScore.get(cur));
            for(Edge e:g.edges(cur)){
                double tentative=gScore.get(cur)+e.cost;
                if(tentative<gScore.getOrDefault(e.to,Double.POSITIVE_INFINITY)){
                    came.put(e.to,cur); gScore.put(e.to,tentative);
                    double hh=(algo==Algo.A_STAR)?h.applyAsDouble(g.nodes.get(e.to),g.nodes.get(goal)):0.0;
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

    // --- Heuristic ---
    static double haversine(Node a,Node b){
        double R=6371000,dLat=Math.toRadians(b.lat-a.lat),dLon=Math.toRadians(b.lon-a.lon);
        double s1=Math.sin(dLat/2),s2=Math.sin(dLon/2);
        double aa=s1*s1+Math.cos(Math.toRadians(a.lat))*Math.cos(Math.toRadians(b.lat))*s2*s2;
        return R*2*Math.atan2(Math.sqrt(aa),Math.sqrt(1-aa));
    }
    static ToDoubleBiFunction<Node,Node> straightLineMinutes(double mpm){
        return (n,g)->haversine(n,g)/(mpm<=0?1:mpm);
    }

    // --- Demo endpoint ---
    @GetMapping("/route")
    public ResponseEntity<?> route(@RequestParam String start,
                                   @RequestParam String goal,
                                   @RequestParam(defaultValue="DIJKSTRA") String algo){
        Graph g=new Graph();
        Node stadium=new Node("STADIUM",51.6043,-0.0664);
        Node station=new Node("SEVEN_SISTERS",51.5832,-0.0722);
        Node interchange=new Node("LIV_ST_INTERCHANGE",51.5176,-0.0824);
        Node dest=new Node("MILTON_KEYNES",52.0406,-0.7594);
        g.addNode(stadium);g.addNode(station);g.addNode(interchange);g.addNode(dest);
        g.addEdge(new Edge("STADIUM","SEVEN_SISTERS",20));
        g.addEdge(new Edge("SEVEN_SISTERS","LIV_ST_INTERCHANGE",18));
        g.addEdge(new Edge("LIV_ST_INTERCHANGE","MILTON_KEYNES",60));
        g.addEdge(new Edge("STADIUM","LIV_ST_INTERCHANGE",35));
        g.addEdge(new Edge("SEVEN_SISTERS","MILTON_KEYNES",80));

        Algo chosen=algo.equalsIgnoreCase("A_STAR")?Algo.A_STAR:Algo.DIJKSTRA;
        Route r=route(g,start,goal,chosen,straightLineMinutes(800));
        return ResponseEntity.ok(Map.of("nodes",r.path,"totalCostMinutes",r.cost,"algorithm",chosen));
    }
}