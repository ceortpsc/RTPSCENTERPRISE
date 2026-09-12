import SwiftUI

struct RootView: View {
    @EnvironmentObject private var appModel: AppModel

    private let purple = Color(red: 109/255, green: 40/255, blue: 217/255)
    private let pink = Color(red: 236/255, green: 72/255, blue: 153/255)

    var body: some View {
        TabView {
            NavigationStack {
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Comeaux Clinical")
                            .font(.largeTitle.bold())
                        Text("Medical supply, verified savings, education and mobile account access.")
                            .foregroundStyle(.secondary)

                        if appModel.isLoading {
                            ProgressView("Loading platform configuration…")
                        } else if let bootstrap = appModel.bootstrapData {
                            GroupBox("Platform") {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(bootstrap.brand.name).font(.headline)
                                    Text("API \(bootstrap.apiVersion) • iOS \(bootstrap.minimumIOS)+")
                                    Text("Training: \(bootstrap.features["training"] == true ? "Enabled" : "Disabled")")
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        } else if let message = appModel.errorMessage {
                            Text(message).foregroundStyle(.red)
                        }

                        VStack(spacing: 12) {
                            NavigationLink("Shop Nursing Supplies") { WebDestination(title: "Store", path: "/comeaux-supply/products") }
                            NavigationLink("Training & Academy") { WebDestination(title: "Training", path: "/comeaux-supply/training") }
                            NavigationLink("Verified Savings") { WebDestination(title: "Savings", path: "/comeaux-supply/discounts") }
                            NavigationLink("Customer Account") { WebDestination(title: "Account", path: "/comeaux-supply/account") }
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(purple)
                    }
                    .padding(24)
                }
                .toolbarBackground(.visible, for: .navigationBar)
            }
            .tabItem { Label("Home", systemImage: "cross.case.fill") }

            NavigationStack {
                VStack(spacing: 16) {
                    Image(systemName: "books.vertical.fill").font(.system(size: 44)).foregroundStyle(pink)
                    Text("Comeaux Clinical Training").font(.title2.bold())
                    Text("Course progress, knowledge checks and instructor-gated clinical skills will appear here when the LMS APIs are enabled.")
                        .multilineTextAlignment(.center)
                        .foregroundStyle(.secondary)
                }
                .padding(28)
            }
            .tabItem { Label("Academy", systemImage: "graduationcap.fill") }
        }
        .tint(purple)
    }
}

private struct WebDestination: View {
    let title: String
    let path: String

    var body: some View {
        VStack(spacing: 12) {
            Text(title).font(.title.bold())
            Text(path).font(.footnote.monospaced()).foregroundStyle(.secondary)
            Text("Native feature shell ready for authenticated API-backed implementation.")
                .multilineTextAlignment(.center)
        }
        .padding(24)
    }
}
