package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Collections;

/**
 * Computes shortest routes for predefined travel nodes.
 */
@Service
public class RouteService {

    /**
     * Immutable route result returned to controllers and services.
     */
    public record RouteResult(List<String> path, double totalCostMinutes, String algorithm) {
    }

    private static final String ALGORITHM = "DIJKSTRA";

    /**
     * Finds the shortest route between two supported nodes.
     *
     * @param start start node id
     * @param goal goal node id
     * @return route result with node sequence and total cost
     */
    public RouteResult findShortestRoute(String start, String goal) {
        Graph graph = createDefaultGraph();
        RouteResult raw = dijkstra(graph, start, goal);
        return new RouteResult(raw.path(), raw.totalCostMinutes(), ALGORITHM);
    }

    private Graph createDefaultGraph() {
        Graph g = new Graph();
        g.addNode("STADIUM");
        g.addNode("SEVEN_SISTERS");
        g.addNode("LIV_ST_INTERCHANGE");
        g.addNode("MILTON_KEYNES");

        g.addEdge("STADIUM", "SEVEN_SISTERS", 20);
        g.addEdge("SEVEN_SISTERS", "LIV_ST_INTERCHANGE", 18);
        g.addEdge("LIV_ST_INTERCHANGE", "MILTON_KEYNES", 60);
        g.addEdge("STADIUM", "LIV_ST_INTERCHANGE", 35);
        g.addEdge("SEVEN_SISTERS", "MILTON_KEYNES", 80);
        return g;
    }

    private RouteResult dijkstra(Graph g, String start, String goal) {
        if (!g.nodes.contains(start) || !g.nodes.contains(goal)) {
            return new RouteResult(List.of(), Double.POSITIVE_INFINITY, ALGORITHM);
        }

        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        for (String id : g.nodes) {
            dist.put(id, Double.POSITIVE_INFINITY);
        }

        dist.put(start, 0.0);
        PriorityQueue<String> pq = new PriorityQueue<>(Comparator.comparingDouble(dist::get));
        pq.add(start);

        while (!pq.isEmpty()) {
            String cur = pq.poll();
            if (cur.equals(goal)) {
                return reconstruct(prev, cur, dist.get(cur));
            }

            for (Edge e : g.edges(cur)) {
                double alt = dist.get(cur) + e.cost;
                if (alt < dist.getOrDefault(e.to, Double.POSITIVE_INFINITY)) {
                    dist.put(e.to, alt);
                    prev.put(e.to, cur);
                    pq.add(e.to);
                }
            }
        }

        return new RouteResult(List.of(), Double.POSITIVE_INFINITY, ALGORITHM);
    }

    private RouteResult reconstruct(Map<String, String> prev, String goal, double cost) {
        List<String> path = new ArrayList<>();
        String cur = goal;
        while (cur != null) {
            path.add(cur);
            cur = prev.get(cur);
        }
        Collections.reverse(path);
        return new RouteResult(path, cost, ALGORITHM);
    }

    private record Edge(String to, double cost) {
    }

    private static final class Graph {
        private final List<String> nodes = new ArrayList<>();
        private final Map<String, List<Edge>> adj = new HashMap<>();

        private void addNode(String id) {
            nodes.add(id);
            adj.putIfAbsent(id, new ArrayList<>());
        }

        private void addEdge(String from, String to, double cost) {
            adj.get(from).add(new Edge(to, cost));
        }

        private List<Edge> edges(String id) {
            return adj.getOrDefault(id, List.of());
        }
    }
}
