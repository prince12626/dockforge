import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

export default function TabLayout() {
      return (
            <Tabs
                  screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: "#fff",
                        tabBarInactiveTintColor: "#9CA3AF",
                        tabBarShowLabel: false,
                        tabBarStyle: {
                              backgroundColor: "#0D0D0D",
                              borderTopColor: "#1F2937",
                              height: 70,
                              paddingBottom: 8,
                              paddingTop: 10,
                        },
                  }}
            >
                  <Tabs.Screen
                        name="index"
                        options={{
                              title: "Dashboard",
                              tabBarIcon: ({ color, size, focused }) => (
                                    <Ionicons
                                          name={
                                                focused
                                                      ? "grid"
                                                      : "grid-outline"
                                          }
                                          size={size}
                                          color={color}
                                    />
                              ),
                        }}
                  />
                  <Tabs.Screen
                        name="vps/vpses"
                        options={{
                              title: "VPSes",
                              tabBarIcon: ({ color, size, focused }) => (
                                    <Ionicons
                                          name={
                                                focused
                                                      ? "server"
                                                      : "server-outline"
                                          }
                                          size={size}
                                          color={color}
                                    />
                              ),
                        }}
                  />
                  <Tabs.Screen
                        name="billing"
                        options={{
                              title: "Billing",
                              tabBarIcon: ({ color, size, focused }) => (
                                    <Entypo
                                          name={
                                                focused
                                                      ? "text-document"
                                                      : "text-document-inverted"
                                          }
                                          size={size}
                                          color={color}
                                    />
                              ),
                        }}
                  />
                  <Tabs.Screen
                        name="profile"
                        options={{
                              title: "Profile",
                              tabBarIcon: ({ color, size, focused }) => (
                                    <Ionicons
                                          name={
                                                focused
                                                      ? "person"
                                                      : "person-outline"
                                          }
                                          size={size}
                                          color={color}
                                    />
                              ),
                        }}
                  />
            </Tabs>
      );
}
