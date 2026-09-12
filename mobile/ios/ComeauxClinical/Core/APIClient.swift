import Foundation

struct MobileBootstrap: Decodable {
    struct Brand: Decodable {
        struct Theme: Decodable {
            let background: String
            let foreground: String
            let purple: String
            let pink: String
        }
        let name: String
        let academy: String
        let theme: Theme
    }

    let apiVersion: String
    let minimumIOS: String
    let brand: Brand
    let features: [String: Bool]
    let endpoints: [String: URL]
}

enum APIClientError: Error {
    case invalidResponse
}

struct APIClient {
    let baseURL: URL

    func fetchBootstrap() async throws -> MobileBootstrap {
        let url = baseURL.appending(path: "/api/comeaux/mobile/bootstrap")
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIClientError.invalidResponse
        }
        return try JSONDecoder().decode(MobileBootstrap.self, from: data)
    }
}

@MainActor
final class AppModel: ObservableObject {
    @Published var bootstrapData: MobileBootstrap?
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let api = APIClient(
        baseURL: URL(string: ProcessInfo.processInfo.environment["COMEAUX_API_ORIGIN"] ?? "https://comeaux-clinical-store-staging.onrender.com")!
    )

    func bootstrap() async {
        isLoading = true
        defer { isLoading = false }
        do {
            bootstrapData = try await api.fetchBootstrap()
            errorMessage = nil
        } catch {
            errorMessage = "Unable to load the Comeaux Clinical mobile configuration."
        }
    }
}
